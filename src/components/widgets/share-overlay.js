import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './widgets.scss';
import cx from 'classnames';
import { getItem } from "../../core/browser-storage";
import actions from '../../flux/actions';
import stores from '../../flux/stores';

import { getShareDownloadURL } from '../../core/qt-core';

class ShareOverlay extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      mobile: false,
      share: false,
      download: false,
      charge: false,
      url: null,
      isDisplayDialog:false,
      albumInfo: null
    }
  }

  componentDidMount() {
    this.unsub = stores.listen(this.onTrigger.bind(this)); 
  }
  
  componentWillUnmount() {
    this.unsub();
  }

  onTrigger(key, data) {
    if(this.state.albumInfo === null){
      this.setState({albumInfo:{
        cid: data.cid,
        pid: data.pid,
      }})
    }
    if(key === 'ShowPlayDialog')
      (this._setDisplayPlayDialog() ? this.setState({isDisplayDialog:true}):this.setState({isDisplayDialog:false}))

    this._triggerMap(key) && this._triggerMap(key)(data);
  }

  render() {
    const self = this;
    const handleClickDownload = function () {
      self.trackEvent(self.state.albumInfo, 'Button','appDownload')
      setTimeout(() =>{ window.open('https://sss.qingting.fm/', '_self') }, 500);
    }
    let imgURL = this.state.url ? `https://pay.qingting.fm/qr/${encodeURIComponent(this.state.url)}` : "/images/msite_qrcode.png";
    return (
      <div className={cx(s.shareOverlayRoot, this.state.download || this.state.share || this.state.charge || this.state.play || this.state.mobile ? s.visible : '')}>
        <div className={s.overlay} onClick={this.onStopPropagation}></div>
        <div className={s.container}>
        { this.state.play ?
          <div className={s.playWrapper}>
            <div role="close share/download/play" tabIndex="4" className={s.shareDownloadClose} onClick={this.onClose.bind(this)}>
              <span className="sprite5"></span>
            </div>
            <div className={s.title}>
              下载蜻蜓FM领会员
            </div>
            <div className={s.playbottomWrapper}>
              <div className={s.playLeftSec}>
                <div className={s.playQR}></div>
                <div className={s.bottomNotice}>扫描二维码领会员</div>
              </div>
              <div className={s.playRightSec}>
                <div className={s.firstContent}>1.登录蜻蜓FM手机APP</div>
                <span className={s.firstNotice}>没有安装手机APP？</span>
                <div className={s.downloadBtn} onClick={handleClickDownload}><div className={s.downloadIcon}></div>下载APP</div>
                <div className={s.rightContent}>2.点击「我的」页面右上角<div className={s.scanIcon}></div></div>
                <div className={s.rightContent}>3.扫描左侧二维码</div>
                <div className={s.rightContent}>4.免费领取会员</div>
              </div> 
            </div>
          </div> : ''}
          { this.state.mobile ?
          <div className={s.playWrapper}>
          <div role="close share/download/play" tabIndex="4" className={s.shareDownloadClose} onClick={this.onClose.bind(this)}>
            <span className="sprite5"></span>
          </div>
          <div className={s.mobileTitle}>
             同步到手机听
          </div>
          <div className={s.playbottomWrapper}>
            <div className={s.playLeftSec}>
              <div className={s.mobileQR}><img className={s.QRimg} src={imgURL}></img></div>
              <div className={s.bottomNotice}>扫描二维码收听</div>
            </div>
            <div className={s.playRightSec} withStyles>
              <div className={s.firstContent}>1.登录蜻蜓FM手机APP</div>
              <span className={s.firstNotice}>没有安装手机APP？</span>
              <div className={s.downloadBtn} onClick={handleClickDownload}><div className={s.downloadIcon}></div>下载APP</div>
              <div className={s.rightContent}>2.点击「我的」页面右上角<div className={s.scanIcon}></div></div>
              <div className={s.rightContent}>3.扫描左侧二维码</div>
              <div className={s.rightContent}>4.在线收听或下载声音到手机听</div>
            </div> 
          </div>
        </div> : ''}
        { this.state.share ?
          <div className={s.shareDownloadWrapper}>
            <div role="close share/download" tabIndex="4" className={s.shareDownloadClose} onClick={this.onClose.bind(this)}>
              <span className="sprite5"></span>
            </div>
            <div className={s.title}>
              <div className={s.t1}>好的东西值得分享</div>
              <div className={s.t2}>分享音频 扫一扫右侧二维码</div>
            </div>
            <div className={s.bottomWrapper}>
              <div className={s.leftSec}><img className={s.shareScene} src={'http://sss.qingting.fm/neo/ShareSecne@3x.png'}></img></div>
              <div className={s.rightSec}><img className={s.QR} src={imgURL}></img></div> 
            </div>
          </div> : ''}
        { this.state.download ?
          <div className={s.shareDownloadWrapper}>
           <div role="close share/download" tabIndex="4" className={s.shareDownloadClose} onClick={this.onClose.bind(this)}>
              <span className="sprite5"></span>
            </div>
            <div className={s.title}>
              <div className={s.t1}>上下班路上无聊？听蜻蜓FM</div>
              <div className={s.t2}>高清音质畅听无阻 扫二维码下载蜻蜓FM</div>
            </div>
            <div className={s.bottomWrapper}>
              <div className={s.leftSec}><img className={s.shareScene} src={'http://sss.qingting.fm/neo/DownloadSecne@3x.png'}></img></div>
              <div className={s.rightSec}><img className={s.QR} src={imgURL}></img></div> 
            </div>
          </div> : ''}
        { this.state.charge ?
          <div className={s.wrapper}>
            <div role="close share/download" tabIndex="4" className={s.close} onClick={this.onClose.bind(this)}>
              <span className="sprite2 sprite2-quit"></span>
              <div className={s.vertLine}></div>
            </div>
            <div className={s.chargeTitle}>这是付费内容哦，您可通过扫描二维码直接购买，或前往APP内进行购买后收听~</div>
            <img alt="扫描听节目" src={imgURL}/>            
          </div> : ''}
        </div>
      </div>
    )
  }

  _setDisplayPlayDialog(){
    const PLAY_DIALOG_KEY = 'playDialog';
    const currentTimeStamp =  new Date().getTime();
    if(localStorage.getItem(PLAY_DIALOG_KEY) == null){
      localStorage.setItem(PLAY_DIALOG_KEY , JSON.stringify({displayTimes:1,startTimeStamp:currentTimeStamp}));
      return true;
    }
    else{
      let storageData = JSON.parse(localStorage.getItem(PLAY_DIALOG_KEY)); 
      const expireTimestamp = storageData.startTimeStamp + (24 * 60 * 60 * 1000);
      if(new Date().getTime() > expireTimestamp){
        localStorage.removeItem(PLAY_DIALOG_KEY);
        setTimeout(localStorage.setItem(PLAY_DIALOG_KEY , JSON.stringify({displayTimes:1,startTimeStamp:currentTimeStamp})),300);
        return true;
      }   
      else{
          return false;
      }
    }
  }

  _triggerMap(key) {
    let self = this;
    let map = {
      ShowPlayDialog(data) { 
        if(self.state.isDisplayDialog){
          self.trackEvent(data,'PopUp' ,'memberPop');
          self.setState({
            play: true,
            mobile: false,
            share: false,
            download: false,
            charge: false,
            url: getShareDownloadURL(data.cid)
          })
        }
      },
      ShowPlayDialog(data) { 
        if(self.state.isDisplayDialog){
          self.trackEvent(data,'PopUp' ,'memberPop');
          self.setState({
            play: true,
            mobile: false,
            share: false,
            download: false,
            charge: false,
            url: getShareDownloadURL(data.cid, data.pid)
          })
        }
      },
      mobileAlbum(data) {
        self.trackEvent(data, 'PopUp', 'mobileListeningPop');
        self.setState({
          play: false,
          mobile: true,
          share: false,
          download: false,
          charge: false,
          url: getShareDownloadURL(data.cid)
        })
      },
      mobileProgram(data) {
        self.trackEvent(data, 'PopUp', 'mobileListeningPop');
        self.setState({
          play: false,
          mobile: true,
          share: false,
          download: false,
          charge: false,
          url: getShareDownloadURL(data.cid, data.pid)
        })
      },
      shareAlbum(data) {
        self.trackEvent(data, 'PopUp', 'sharePop');
        self.setState({
          play: false,
          mobile: false,
          share: true,
          download: false,
          charge: false,
          url: getShareDownloadURL(data.cid)
        })
      },
      shareProgram(data) {
        self.trackEvent(data, 'PopUp', 'sharePop');
        self.setState({
          play: false,
          mobile: false,
          share: true,
          download: false,
          charge: false,
          url: getShareDownloadURL(data.cid, data.pid)
        })
      },
      downloadAlbum(data) {
        self.trackEvent(data, 'PopUp', 'downloadPop');
        self.setState({
          play: false,
          mobile: false,
          share: false,
          download: true,
          charge: false,
          url: getShareDownloadURL(data.cid)          
        })
      },
      downloadProgram(data) {
        self.trackEvent(data, 'PopUp', 'downloadPop');
        self.setState({
          play: false,
          mobile: false,
          share: false,
          download: true,
          charge: false,
          url: getShareDownloadURL(data.cid, data.pid)          
        })
      },
      chargeModal(data) {
        self.setState({
          play: false,
          mobile: false,
          share: false,
          download: false,
          charge: true,
          url: getShareDownloadURL(data.cid, data.pid)
        })
      }
    };
    return map[key];
  }

  trackEvent(data, type, name){
    qtWebLog.push('_trackEvent', name, {
      channel_id: data.cid,
      program_id: data.pid,
      qingting_id: getItem('uat'),
      pos:{
        "type":type,
        "name":name
      }
    })
  }
  
  onClose(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      play: false,
      mobile: false,
      share: false,
      download: false,
      charge: false
    });
  }

  onStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }


}

export default withStyles(s)(ShareOverlay);

