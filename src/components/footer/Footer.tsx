import React from 'react';
import { SiGithub, SiMaildotru } from 'react-icons/si';
import { RiGitRepositoryFill } from 'react-icons/ri';
import config from 'site-config';

interface FooterProps {}

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className='p-14 footer footer-center bg-primary text-primary-content'>
      <div>
        <p className='text-5xl font-bold'>{config.infomation.nickname}</p>
      </div>
      <div>
        <div className='grid grid-flow-col gap-4 text-3xl'>
          {config.infomation.email && (
            <a className='tooltip' data-tip='send mail' href={'mailto:' + config.infomation.email}>
              <div>
                <SiMaildotru />
              </div>
            </a>
          )}
          {config.infomation.github && (
            <a
              className='tooltip'
              data-tip='GitHub'
              href={config.infomation.github}
              rel='noreferrer'
              target='_blank'
            >
              <div>
                <SiGithub />
              </div>
            </a>
          )}
          {config.infomation.repository && (
            <a
              className='tooltip'
              data-tip='repository'
              href={config.infomation.repository}
              rel='noreferrer'
              target='_blank'
            >
              <div>
                <RiGitRepositoryFill />
              </div>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
