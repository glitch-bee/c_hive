import React, { Component } from 'react'
import Leaflet from 'leaflet';
import { Map, TileLayer } from 'react-leaflet'
import Markerdisplay from './marker';
import 'leaflet/dist/leaflet.css';
import { input, select } from 'notie'
import axios from 'axios';
import config from '../config';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';



Leaflet.Icon.Default.imagePath =
    '../node_modules/leaflet'

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});



class Mapdisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 28.257017,
            lng: 77.077524,
            zoom: 4,
            name: '',
            notes: '',
            markerType: 'hive',
            photo: '',
            users: props.users
        }
    }


    getLocation(name, notes, markerType, photo) {
        var options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition((pos) => {
            this.setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, name, notes, markerType, photo });
            this.addUser();
        }, (err) => JSON.stringify(err), options);
    }
    addUser() {

        let user = {
            name: this.state.name,
            notes: this.state.notes,
            markerType: this.state.markerType,
            photo: this.state.photo,
            location: {
                lat: this.state.lat, lng: this.state.lng
            }

        }
      
        return axios({
            method: 'post',
            url: config.endPoint.addUser,
            data: user
        });
        //    var res = await axios.post(, user);

    }
    componentDidMount() {
        this.MarkerInput();
    }

    loadUsers(users) {
        if (users.length > 0) {
            var marker = users.map(e => {
                return <Markerdisplay key={e.name + e.location.lat + e.location.lng + (e.notes || '')} position={[e.location.lat, e.location.lng]} name={e.name} notes={e.notes} markerType={e.markerType} photo={e.photo} />
            })
            return marker;
        }
        return;


    }

    MarkerInput() {
        input({
            text: "Name", submitCallback: (nameValue) => {
                select({
                    text: 'Select marker type:',
                    choices: [
                        { type: 1, text: 'Hive', handler: () => this._handleMarkerType(nameValue, 'hive') },
                        { type: 2, text: 'Swarm', handler: () => this._handleMarkerType(nameValue, 'swarm') },
                        { type: 3, text: 'Tree', handler: () => this._handleMarkerType(nameValue, 'tree') },
                        { type: 4, text: 'Structure', handler: () => this._handleMarkerType(nameValue, 'structure') },
                    ]
                });
            }
        })
    }

    _handleMarkerType(nameValue, markerType) {
        input({
            text: "Notes (optional)", type: 2, submitCallback: (notesValue) => {
                input({
                    text: "Photo URL (optional)", type: 2, submitCallback: (photoValue) => {
                        this.getLocation(nameValue, notesValue, markerType, photoValue);
                    }
                })
            }
        })
    }


    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <Map center={position} zoom={this.state.zoom} style={{ height: '450px' }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.state.name !== '' ? <Markerdisplay position={[this.state.lat, this.state.lng]} name={this.state.name} notes={this.state.notes} markerType={this.state.markerType} photo={this.state.photo} /> : ''}
                {this.loadUsers(this.state.users)}
            </Map>
        )
    }
}
export default Mapdisplay;