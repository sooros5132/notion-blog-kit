'use client';

import { SiGithub, SiMaildotru } from 'react-icons/si';
import { RiGitRepositoryFill } from 'react-icons/ri';
import { siteConfig } from '@/lib/site-config';

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className='text-foreground'>
      <div className='bg-card'>
        <div className='max-w-7xl flex justify-between align-center mx-auto py-2 px-4'>
          <div className='text-xl font-bold'>{siteConfig.infomation.blogname}</div>
          <div className='flex items-center gap-2 text-2xl'>
            {siteConfig.infomation.email && (
              <a href={'mailto:' + siteConfig.infomation.email} aria-label='send mail link'>
                <SiMaildotru />
              </a>
            )}
            {siteConfig.infomation.github && (
              <a
                href={siteConfig.infomation.github}
                rel='noreferrer'
                target='_blank'
                aria-label='visit github'
              >
                <SiGithub />
              </a>
            )}
            {siteConfig.infomation.repository && (
              <a
                href={siteConfig.infomation.repository}
                rel='noreferrer'
                target='_blank'
                aria-label='visit repository'
              >
                <RiGitRepositoryFill />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
