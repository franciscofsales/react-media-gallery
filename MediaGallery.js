import React, { Component, PropTypes } from 'react';
import TransitionGroup from 'react-addons-transition-group';
import Lightbox from './Lightbox';
import './style.css';

const style = {
   display: 'block',
   margin: 4,

   float: 'left'
}

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
      if(this.props.media.length > 3)
        rowLimit = 2;
      else
        rowLimit = 1;
        // rowLimit = Math.ceil( Math.sqrt(this.props.media.length) );

      let imageLengthEval = Math.min(this.props.media.length, 4);
      widthSize = Math.floor(this.state.galleryRef.clientWidth/rowLimit)-(8 * (rowLimit - 1));
      heightSize = Math.floor(this.state.galleryRef.parentNode.clientHeight/(Math.ceil(imageLengthEval/rowLimit) ) ) - (8 * (Math.floor(imageLengthEval/rowLimit) - 1));


    }



    for (let i=0; i < this.props.media.length; i++){

        if(i < 3 || this.props.media.length < 5) {
          if (this.props.disableLightbox){
            mediaPreviewNodes.push(
          	 <div key={i} style={style}>
          	    <img src={this.props.media[i].src} style={{display:'block', border:0, borderRadius:3, objectFit: 'cover', height: heightSize, width: widthSize}} />
          	 </div>
            );
          }
          else {
            lightboxMedia.push(this.props.media[i]);
            if(this.props.media[i].type != 'video'){
      		    mediaPreviewNodes.push(
          			 <div key={i} style={style}>
          			    <a href="#" className={i} onClick={this.openLightbox.bind(this, i)}>
                      <img src={this.props.media[i].src} style={{display:'block', borderRadius:3, border:0, objectFit: 'cover'}} height={heightSize} width={widthSize}/>
                    </a>
          			 </div>
      		    );
            }
            else{
              mediaPreviewNodes.push(
          			 <div key={i} style={style}>
          			    <a href="#" className={i} onClick={this.openLightbox.bind(this, i)}>
                      <video style={{display:'block', borderRadius:3, border:0, objectFit: 'cover'}} height={heightSize} width={widthSize} controls>
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
          	 <div key={i} style={style}>
          	    <div style={{height: heightSize, width: widthSize}}  className="numberContainer">
                  <div className="numberContainer">+ {this.props.media.length - 3}</div>
                </div>
          	 </div>
            );
          }
          else{
            lightboxMedia.push(this.props.media[i]);
    		    mediaPreviewNodes.push(
        			 <div key={i} style={style}>
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
      <div ref={(galleryRef) => { if(!this.state.galleryRef) this.setState({galleryRef}); }} style={{flex:1, alignSelf:'stretch'}}>
        {this.renderGallery(mediaPreviewNodes, lightboxMedia)}
      </div>
    );
  }
}


export default MediaGallery;
