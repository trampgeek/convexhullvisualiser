/*
    Copyright (C) 2019  Richard Lobb

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version. See <https://www.gnu.org/licenses/>

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */

// The module defines the GrahamScan algorithm.
/*jshint esnext:true */

define(["geom"], function (geom) {

    const TEST_LINE_STYLE = {color: 'blue', width: 2, dash: 'dot', name: 'Candidate'};
    const SORTED_POINTS_STYLE = {color: 'rgb(200, 200, 200)', width: 1, dash: 'dash', name: 'Skeleton'};
    const RADIUS_VECTOR_STYLE = {color: 'rgb(150, 150, 255)', width: 1, dash: 'solid', name: 'Sorted radius vectors'};

    // Return a sequence of states to visualise the progress of the
    // Graham Scan convex hull algorithm. State0 represents the starting state
    // and the last state represents the final convex hull state.
    // Each state is an object with lines and hull attributes. The lines
    // attribute is a list of objects with a points attribute (a list of
    // geom.Vec objects) and astyle attribute containing Plotly trace attributes.
    //
    function grahamScan(points) {

        var p, p0, hull = [], i, states = [],
            vectors = [], rest, skeleton = {points: [], style: SORTED_POINTS_STYLE};

        function pushState(lines) {
            states.push({lines: [skeleton].concat(lines), hull: hull.slice()});
        }

        function keepLeft(p) {
            // Append Geom.vec p to the hull point list, deleting any intermediate points
            // that break the pattern of a continuous sequence of left turns.
            while (hull.length > 1 && !hull[hull.length-1].minus(hull[hull.length-2]).isLeftTurn(p.minus(hull[hull.length-1]))) {
                pushState([ {points: [p, hull[hull.length-1]], style: TEST_LINE_STYLE}]);
                hull.pop();
            }
            if (hull.length === 0 || hull[-1] !== p) {
                hull.push(p);
            }
            pushState([]);
        }

        if (points.length < 3) {
            // With fewer than 3 points, just return those points as the hull
            hull = points;
            if (points.length == 2) {
                hull.push(points[0]); // If there are two points, close the hull
            }
            pushState([]);
            return states;
        }

        // Get the bottom-most (and left-most if necessary) point as points[0]
        for (i = 1; i < points.length; i++) {
            p = points[i];
            if (p[1] < points[0][1] || (p[1] === points[0][1] && p[0] < points[0][0])) {
                points[i] = points[0];
                points[0] = p;
            }
        }

        // Sort all points p[1:] so that vectors {p - points[0]} are in CCW order.
        p0 = new geom.Vec(points[0]);
        rest = [];
        for (i = 1; i < points.length; i++) {
            rest.push(new geom.Vec(points[i]));
        }
        rest.sort(function(a, b) {
            var va = a.minus(p0),
                vb = b.minus(p0);
                if (va.isParallel(vb)) {
                    return 0;
                } else if (va.isLeftTurn(vb)) {
                    return -1;
                } else {
                    return +1;
                }
            });

        // Copy sorted points back over original data in case the display
        // is numbering the points.
        for (i = 1; i < points.length; i++) {
            points[i] = [rest[i - 1].x, rest[i - 1].y];
        }

        pushState([]);
        skeleton = {points:[p0].concat(rest).concat([p0]), style: SORTED_POINTS_STYLE};
        vectors.push(p0);
        for (i = 0; i < rest.length; i++) {
            vectors.push(rest[i]);
            vectors.push(p0);
        }
        pushState({points: vectors, style: RADIUS_VECTOR_STYLE});  // Display the skeleton plus vectors from p0
        hull = [p0, rest[0], rest[1]];
        pushState([]);  // Followed by the hull's first 3 points

        // Now generate the rest of the hull
        for (i = 2; i < rest.length; i++) {
            keepLeft(rest[i]);
        }

        keepLeft(p0);  // Close the loop
        return states;
    }

    return grahamScan;
});
