import React from 'react'
import { Gmaps, Marker } from 'react-gmaps'

const coords = { lat: -36.875865, lng: 174.869912 }
const params = { v: '3.exp', key: 'AIzaSyCQ9Ni14O9xt1KAJ6d4H6M_eRWIyL2liCY' }

export default class Maps extends React.Component {
  onMapCreated (map) {
    map.setOptions({
      disableDefaultUI: true
    })
  }

  render () {
    return (
      <Gmaps
        className="contact-map"
        width={'350px'}
        height={'350px'}
        lat={coords.lat}
        lng={coords.lng}
        zoom={15}
        loadingMessage={'Be happy'}
        params={params}
        onMapCreated={this.onMapCreated}>
        <Marker
          lat={coords.lat}
          lng={coords.lng}
          draggable={true}
          onDragEnd={this.onDragEnd} />
      </Gmaps>
    )
  }
}
