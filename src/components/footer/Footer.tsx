import React from 'react';
import { SiGithub, SiMaildotru } from 'react-icons/si';
import { RiGitRepositoryFill } from 'react-icons/ri';

interface FooterProps {}

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className='p-14 footer footer-center bg-primary text-primary-content'>
      <div>
        <p className='text-6xl font-bold'>soolog</p>
        <p>
          Copyright{' '}
          <a
            className='underline'
            href='mailto:sooros5132@gmail.com'
            rel='noreferrer'
            target='_blank'
          >
            sooros
          </a>{' '}
          2022 - All right reserved
        </p>
      </div>
      <div>
        <div className='grid grid-flow-col gap-4 text-3xl'>
          <a className='tooltip' data-tip='send mail' href='mailto:sooros5132@gmail.com'>
            <div>
              <SiMaildotru />
            </div>
          </a>
          <a
            className='tooltip'
            data-tip='GitHub'
            href='https://github.com/sooros5132'
            rel='noreferrer'
            target='_blank'
          >
            <div>
              <SiGithub />
            </div>
          </a>
          <a
            className='tooltip'
            data-tip='soolog Repository'
            href='https://github.com/sooros5132/soolog'
            rel='noreferrer'
            target='_blank'
          >
            <div>
              <RiGitRepositoryFill />
            </div>
          </a>
        </div>
      </div>
      {/* {process.env.NODE_ENV === 'production' ? (
      <img src='https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fblog.sooros.com&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false'></img>
    ) : (
      'hits'
    )} */}
    </footer>
  );
};
Footer.displayName = 'Footer';

export default Footer;
