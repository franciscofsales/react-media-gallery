import React, {Component} from 'react';
import TweenLite from 'gsap';
import {findDOMNode} from 'react-dom';
import TransitionGroup from 'react-addons-transition-group';
import MediaItem from './MediaItem';
import './style.css';

const KEYS = {
    ESC:         27,
    LEFT_ARROW:  37,
    RIGHT_ARROW: 39,
};

class Lightbox extends Component {
  constructor(props){
    super(props);
    this.selectItem = this.selectItem.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.state = {
      isAnimating: false,
    }
  }

  componentWillEnter (callback) {
    TweenLite.fromTo(findDOMNode(this), 0.05, {y: 100, scale:0.5, opacity: 0}, {y: 0, scale:1, opacity: 1, onComplete: callback});
  }

  componentWillLeave(callback) {
    setTimeout(() => {
      TweenLite.fromTo(findDOMNode(this), 0.05, {y:0,scale:1, opacity: 1}, {y:100 , scale:0.5, opacity: 0, onComplete: callback});
    }, this.props.animateOutDelay || 0);
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyboard);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboard);
  }

  handleKeyboard(event) {
    if(event)
      event.stopPropagation();
    const keyCode = event.which || event.keyCode;
    switch (keyCode) {
      case KEYS.ESC:
        this.props.onCloseHandler();
        break;
      case KEYS.LEFT_ARROW:
        this.selectItem('left');
        break;
      case KEYS.RIGHT_ARROW:
        this.selectItem('right');
        break;
      default:
    }

  }


  selectItem(direction) {
    let index = this.props.media.indexOf(this.props.current);

    if(index === 0 && direction == 'left')
      return true;
    if(index === this.props.media.length - 1 && direction == 'right')
      return true;

    if(direction == 'left')
      index--;
    else
      index++;

    this.props.selectItem(this.props.media[index]);
  }


	render() {
    const hasRight = (this.props.media.indexOf(this.props.current) < this.props.media.length - 1);
    const hasLeft = (this.props.media.indexOf(this.props.current) > 0);
    let mediaItems = [];

    const addMedia = (index, key, mediaClass, baseStyle = {}) => {


      mediaItems.push(
          <MediaItem
              className={`${mediaClass}`}
              style={baseStyle}
              selected={this.props.media[index]}
              key={key}
              alt={'Image'}
          />
      );
    }

    addMedia(
        this.props.media.indexOf(this.props.current),
        'mainSrc',
        '',
        {}
    );

		return (
  			<div
          className="lightbox"
          ref={(el) => { this.outerEl = el; }}
        >
  				<div className="lightbox-content">

            <MediaItem selected={this.props.current}/>
            <button
                type="button"
                className="close-button navButtons navButtonClose"
                key="close"
                onClick={this.props.onCloseHandler}
            />
            {hasLeft ? (<button
                type="button"
                className="prev-button navButtons navButtonPrev"
                key="prev"
                onClick={() => this.selectItem('left')}
            />): null}


            {hasRight ? (<button
                 type="button"
                 className="next-button navButtons navButtonNext"
                 key="next"
                 onClick={() => this.selectItem('right')}
             />) : null}
  				</div>
  			</div>
		)
	}
}

export default Lightbox;
