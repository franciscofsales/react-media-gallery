import React, {Component} from 'react';
class MediaItem extends Component {

  render() {
    if(this.props.selected.display_as !== 'video')
      return (<img role="presentation" src={this.props.selected.src} />)

    return (
      <video controls autoPlay>
        <source src={this.props.selected.src} type="video/mp4"/>
      </video>
    )
  }
}

export default MediaItem;
