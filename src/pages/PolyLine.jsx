import React, { useEffect, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

function pathsDiffer(path1, path2) {
    if (path1.length !== path2.length) {
        return true;
    }
    for (let i = 0; i < path2.length; i++) {
        if (path1[i].lat !== path2[i].lat || path1[i].lng !== path2[i].lng) {
            return true;
        }
    }
    return false;
}

function Polyline({ map, path }) {
    const [polyline, setPolyline] = useState(null);

    useDeepCompareEffect(() => {
        if (!polyline && map) {
            setPolyline(new window.google.maps.Polyline());
        }

        if (polyline && polyline.getMap() !== map) {
            polyline.setMap(map);
        }

        if (polyline && pathsDiffer(polyline.getPath().getArray(), path)) {
            polyline.setPath(path.map(point => new window.google.maps.LatLng(point.lat, point.lng)));
        }

        return () => {
            if (polyline) {
                polyline.setMap(null);
            }
        };
    }, [map, path, polyline]);

    return null;
}

export default Polyline;