import React from 'react';

import React from react;
import {
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  UpCircleOutlined,
} from @ant-design/icons;
import { BackTop } from antd;

const AppFooter = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            <a href="/">REACT TS</a>
          </div>
          <ul className="footer-socials">
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/tienduy-nguyen"
              >
                <GithubOutlined />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.twitter.com/tienduy_nguyen"
              >
                <TwitterOutlined />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.linkedin.com/"
              >
                <LinkedinOutlined />
              </a>
            </li>
          </ul>
          <div className="copyright">Copyright &copy; 2020 REACT TS</div>
          <BackTop>
            <div className="go-top">
              <UpCircleOutlined />
            </div>
          </BackTop>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
// Modification 2 - 2025-03-11
// Modification 3 - 2025-03-11
// Modification 4 - 2025-03-11
// Modification 5 - 2025-03-11
// Modification 6 - 2025-03-11
