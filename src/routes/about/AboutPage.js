import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AboutPage.scss';

class AboutPage extends Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.about}>
            <div className={s.title}>
              <div>关于我们</div>
            </div>
            <div className={s.content}>
              <span className={s.qt}>蜻蜓FM</span>
              是一款网络音频应用，自2011年9月发布以来，已成长为中国领先的音频内容聚合平台之一。蜻蜓FM坚持以「更多的世界，用听的」为口号，以创新科技打造具有影响力、备受用户喜爱的音频媒体品牌。
            </div>
            <div className={s.features}>
              <div className={s.subTitle}>特色功能</div>
              <ul>
                <li>
                  <div className={s.bullet}>
                    <span>1</span>
                  </div>
                  <div>下载收听节目，无需担心流量，随时随地随心收听。</div>
                </li>
                <li>
                  <div className={s.bullet}>
                    <span>2</span>
                  </div>
                  <div>
                    收藏电台、关注主播、定时关闭、闹钟提醒，贴心设计让收听更方便。
                  </div>
                </li>
                <li>
                  <div className={s.bullet}>
                    <span>3</span>
                  </div>
                  <div>
                    与主播在微社区和直播专区实时互动，快将你喜欢的节目分享给好友们吧！
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={s.contact}>
            <div className={s.title}>
              <div>联系我们</div>
            </div>
            <div className={s.content}>
              蜻蜓FM倾听全世界的声音。关注新浪官方微博
              &quot蜻蜓FM&quot参与微博互动，更有机会赢取丰厚大礼！微博地址:{' '}
              <a href="http://weibo.com/qingtingfm">
                http://weibo.com/qingtingfm
              </a>{' '}
              电台推荐请私信, DJ建台请私信。欢迎通过以下联系方式联系我们：
            </div>
            <div className={s.contacts}>
              <ul>
                <li>
                  <div>
                    <span className="sprite sprite-support" />
                  </div>
                  <div>
                    <div className={s.kind}>客服邮箱</div>
                    <div className={s.mail}>support@qingtingfm.com</div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="sprite sprite-radio-dj" />
                  </div>
                  <div>
                    <div className={s.kind}>电台、DJ合作</div>
                    <div className={s.mail}>diantaihezuo@qingting.fm</div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="sprite sprite-hr" />
                  </div>
                  <div>
                    <div className={s.kind}>招贤纳士</div>
                    <div className={s.mail}>hr@qingtingfm.com</div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="sprite sprite-business" />
                  </div>
                  <div>
                    <div className={s.kind}>商务合作</div>
                    <div className={s.mail}>business@qingtingfm.com</div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="sprite sprite-marketing" />
                  </div>
                  <div>
                    <div className={s.kind}>市场品牌合作</div>
                    <div className={s.mail}>marketing@qingtingfm.com</div>
                  </div>
                </li>
                <li>
                  <div>
                    <span className="sprite sprite-microphone" />
                  </div>
                  <div>
                    <div className={s.kind}>主播服务</div>
                    <div className={s.mail}>zb@qingting.fm</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={s.map}>
            <img src="/images/map.png" alt="" />
            <div className={s.address}>
              <div className="sprite sprite-icon" />
              <div className={s.saddr}>
                <div className="sprite sprite-location" />
                <div>上海市浦东新区东方路1215号陆家嘴软件园4号楼北单元2楼</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AboutPage);
