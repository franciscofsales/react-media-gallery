import React, { Component } from 'react';
import TransitionGroup from 'react-addons-transition-group';
import Lightbox from './Lightbox';
import './style.scss';


class MediaGallery extends Component {
  constructor() {
     super();
     this.openLightbox = this.openLightbox.bind(this);
     this.selectItem = this.selectItem.bind(this);
     this.state = {
         currentMedia: null,
         containerWidth: 0,
         galleryRef: null,
         lightboxIsOpen: false
     };

  }
  openLightbox(index, event){
        event.preventDefault();
        this.setState({
    	    currentMedia: this.props.media[index],
          lightboxIsOpen: true
        });
  }
  closeLightbox() {
        this.setState({
           currentMedia: null,
           lightboxIsOpen: false,
        });
  }
  selectItem(item, event){
    if(event)
      event.stopPropagation();
    this.setState({
      currentMedia: item
    });
  }

  renderLightbox(){
    if(this.state.lightboxIsOpen){
      return (
          <Lightbox
              current={this.state.currentMedia}
              media={this.props.media}
              selectItem={this.selectItem}
              onCloseHandler={() => this.setState({ lightboxIsOpen: false })}
          />
      )
    }
    return null;
  }

  renderGallery(mediaPreviewNodes, lightboxMedia) {
  	if (this.props.disableLightbox){
	    return(
        <div style={{align:'center'}}>
      		<div id="Gallery" className="clearfix" ref={(c) => this._gallery = c}>
      		    {mediaPreviewNodes}
      		</div>
          <div style={{clear: 'both'}}></div>
        </div>
	    );
  	}
  	else{
	    return(
    		<div id="Gallery" className="clearfix" ref={(c) => this._gallery = c}>
    		    {mediaPreviewNodes}
            <TransitionGroup>
              {this.renderLightbox()}
            </TransitionGroup>
    		</div>
	    );
  	}
  }


  render(){
    let mediaPreviewNodes = [];
    let lightboxMedia = [];
    let rowLimit = 2;
    let widthSize = 100;
    let heightSize = 100;

    if(this.state.galleryRef){
      if(this.props.media.length > 2)
        rowLimit = 2;
      else
        rowLimit = 1;
        // rowLimit = Math.ceil( Math.sqrt(this.props.media.length) );

      let imageLengthEval = Math.min(this.props.media.length, 4);
      widthSize = Math.round(this.state.galleryRef.clientWidth/rowLimit) - rowLimit;
      heightSize = Math.floor(this.state.galleryRef.parentNode.clientHeight/(Math.ceil(imageLengthEval/rowLimit) ) ) - 2 * rowLimit;

    }



    for (let i=0; i < this.props.media.length; i++){
        if(i < 3 || this.props.media.length < 5) {
          let isBigger = (i===0 && this.props.media.length % 2 !== 0 && this.props.media.length > 1);
          if (this.props.disableLightbox){
            mediaPreviewNodes.push(
          	 <div key={i} className="picContainer">
          	    <img role="presentation" src={this.props.media[i].thumb} className="thumbItem" height={heightSize} width={isBigger ? widthSize*2: widthSize - Math.ceil(rowLimit/2)} />
          	 </div>
            );
          }
          else {
            lightboxMedia.push(this.props.media[i]);
            if(this.props.media[i].display_as !== 'video'){
      		    mediaPreviewNodes.push(
          			 <div key={i} className="picContainer">
          			    <a href="#" className={i} onClick={this.openLightbox.bind(this, i)}>
                      <img role="presentation" src={this.props.media[i].thumb} className="thumbItem" height={heightSize} width={isBigger ? widthSize*2: widthSize - Math.ceil(rowLimit/2)}/>
                    </a>
          			 </div>
      		    );
            }
            else{
              mediaPreviewNodes.push(
          			 <div key={i} className="picContainer">
          			    <a href="#" className={i} onClick={this.openLightbox.bind(this, i)}>
                      <video className="thumbItem" height={heightSize} width={widthSize} controls preload="auto">
                        <source src={this.props.media[i].src} type="video/mp4"/>
                      </video>
                    </a>
          			 </div>
      		    );
            }
          }
        }
        else if(i===3 && this.props.media.length > 4){
          if (this.props.disableLightbox){
            mediaPreviewNodes.push(
          	 <div key={i} className="picContainer">
          	    <div style={{height: heightSize, width: widthSize}}  className="numberContainer">
                  <div className="numberContainer">+ {this.props.media.length - 3}</div>
                </div>
          	 </div>
            );
          }
          else{
            lightboxMedia.push(this.props.media[i]);
    		    mediaPreviewNodes.push(
        			 <div key={i} className="picContainer">
        			    <a href="#" className="numberPlaceholder" onClick={this.openLightbox.bind(this, i)}>
                    <div style={{height: heightSize, width: widthSize}}  className="numberContainer">
                      <div className="numberBox">+ {this.props.media.length - 3}</div>
                    </div>
                  </a>
        			 </div>
    		    );
          }
        }
    }
	  return(
      <div ref={(galleryRef) => { if(!this.state.galleryRef) this.setState({galleryRef}); }} className="mediaGallerContainer">
        {this.renderGallery(mediaPreviewNodes, lightboxMedia)}
      </div>
    );
  }
}


export default MediaGallery;
