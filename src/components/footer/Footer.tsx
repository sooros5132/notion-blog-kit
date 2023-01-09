import type React from 'react';
import { SiGithub, SiMaildotru } from 'react-icons/si';
import { RiGitRepositoryFill } from 'react-icons/ri';
import config from 'site-config';

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className='px-2 py-4 sm:px-4 bg-primary text-primary-content'>
      <div className='max-w-screen-lg mx-auto flex justify-between align-center'>
        <div className='text-2xl font-bold'>{config.infomation.blogname}</div>
        <div className='flex items-center gap-2 text-2xl'>
          {config.infomation.email && (
            <a href={'mailto:' + config.infomation.email}>
              <SiMaildotru />
            </a>
          )}
          {config.infomation.github && (
            <a href={config.infomation.github} rel='noreferrer' target='_blank'>
              <SiGithub />
            </a>
          )}
          {config.infomation.repository && (
            <a href={config.infomation.repository} rel='noreferrer' target='_blank'>
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
