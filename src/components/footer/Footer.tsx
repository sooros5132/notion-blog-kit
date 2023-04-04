import type React from 'react';
import { SiGithub, SiMaildotru } from 'react-icons/si';
import { RiGitRepositoryFill } from 'react-icons/ri';
import config from 'site-config';

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className='bg-base-200/50 dark:bg-base-content/5 text-base-content'>
      <div className='flex justify-between align-center max-w-[var(--article-max-width)] mx-auto px-2 py-4'>
        <div className='text-2xl font-bold'>{config.infomation.blogname}</div>
        <div className='flex items-center gap-2 text-2xl'>
          {config.infomation.email && (
            <a href={'mailto:' + config.infomation.email} aria-label='send mail link'>
              <SiMaildotru />
            </a>
          )}
          {config.infomation.github && (
            <a
              href={config.infomation.github}
              rel='noreferrer'
              target='_blank'
              aria-label='visit github'
            >
              <SiGithub />
            </a>
          )}
          {config.infomation.repository && (
            <a
              href={config.infomation.repository}
              rel='noreferrer'
              target='_blank'
              aria-label='visit repository'
            >
              <RiGitRepositoryFill />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
