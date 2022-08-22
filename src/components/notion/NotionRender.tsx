import type {
  NotionBlock,
  IGetNotion,
  RichText,
  INotionSearchObject,
  NotionDatabasesQuery
} from 'src/types/notion';
import useSWR from 'swr';
import config from 'site-config';
import { NotionBlocksRender, NotionChildDatabaseBlock, NotionPageHeader, NotionSeo } from '.';

export interface NotionRenderProps {
  // readonly blocks: Array<NotionBlock>;
  readonly slug: string;
}

// export const EllipsisWrapperBox = styled('div')({
//   overflow: 'hidden',
//   whiteSpace: 'nowrap',
//   maxHeight: '3.1em',
//   textOverflow: 'ellipsis',
//   '& p, a, span': {
//     display: '-webkit-box',
//     whiteSpace: 'normal',
//     WebkitBoxOrient: 'vertical',
//     WebkitLineClamp: '2'
//   }
// });

const NotionRender: React.FC<NotionRenderProps> = ({ slug }): JSX.Element => {
  const { data: blocks } = useSWR<IGetNotion>('/notion/blocks/children/list/' + slug);
  const { data: page } = useSWR<INotionSearchObject>('/notion/pages/' + slug);

  // const { data, error } = useSWR("/key", fetch);

  if (!blocks?.blocks?.results || !page) {
    return (
      <div className='flex-center'>
        <progress className='radial-progress'></progress>
      </div>
    );
  }

  const title =
    page.object === 'page'
      ? page.properties.title?.title?.map((text) => text?.plain_text).join('') || null
      : page.object === 'database'
      ? page.title?.map((text) => text?.plain_text).join('') || null
      : null;
  const description = blocks?.blocks?.results
    ?.slice(0, 10)
    ?.map((block: any) =>
      block?.[block.type]?.rich_text?.map((text: RichText) => text?.plain_text || '')?.join('')
    )
    ?.join(' ')
    .replace(/\n/gm, '');

  return (
    <div className='w-full mb-5 whitespace-pre-wrap'>
      <NotionSeo page={page} title={title} description={description} slug={slug} />
      <NotionPageHeader page={page} title={title} />
      <div className='max-w-screen-lg px-4 mx-auto mt-10 sm:px-6 lg:px-10 [&>*]:m-0.5'>
        {page.object === 'page' ? (
          <NotionBlocksRender blocks={blocks} />
        ) : page.object === 'database' ? (
          <NotionChildDatabaseBlock
            //! key로 useState 초기화 + 리렌더링 강제유발
            key={page.id}
            //! key로 useState 초기화 + 리렌더링 강제유발
            block={
              {
                ...page,
                child_database: {
                  title: title
                }
              } as unknown as NotionBlock
            }
            databases={{ [page.id]: blocks.blocks as unknown as NotionDatabasesQuery }}
          />
        ) : null}
        {page?.id && <NotionHits page={page} />}
      </div>
    </div>
  );
};

const NotionHits: React.FC<{ page: INotionSearchObject }> = ({ page }) => {
  return (
    <div className='flex justify-end pt-5'>
      {process.env.NODE_ENV === 'production' ? (
        <img
          src={`https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${encodeURIComponent(
            `${config.origin}/${page.id}`
          )}&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false`}
        />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          width='75'
          height='20'
        >
          <linearGradient id='smooth' x2='0' y2='100%'>
            <stop offset='0' stopColor='#bbb' stopOpacity='.1' />
            <stop offset='1' stopOpacity='.1' />
          </linearGradient>

          <mask id='round'>
            <rect width='75' height='20' rx='3' ry='3' fill='#fff' />
          </mask>

          <g mask='url(#round)'>
            <rect width='30' height='20' fill='#555555' />
            <rect x='30' width='45' height='20' fill='#79C83D' />
            <rect width='75' height='20' fill='url(#smooth)' />
          </g>

          <g
            fill='#fff'
            textAnchor='middle'
            fontFamily='Verdana,DejaVu Sans,Geneva,sans-serif'
            fontSize='11'
          >
            <text x='16' y='15' fill='#010101' fillOpacity='.3'>
              hits
            </text>
            <text x='16' y='14' fill='#fff'>
              hits
            </text>
            <text x='51.5' y='15' fill='#010101' fillOpacity='.3'>
              {' '}
              1 / 1{' '}
            </text>
            <text x='51.5' y='14' fill='#fff'>
              {' '}
              1 / 1{' '}
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};

NotionRender.displayName = 'NotionRender';

export default NotionRender;
