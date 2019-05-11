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

// The module defines the GiftWrap (Jarvis Scan) algorithm.
/*jshint esnext:true */

define(["geom"], function (geom) {

    const CANDIDATE_LINE_STYLE = {color: 'red', width: 2, dash: 'dash', name: 'Candidate'};
    const TEST_LINE_STYLE = {color: 'blue', width: 2, dash: 'dot', name: 'Probe'};

    // Return a sequence of states to visualise the progress of the
    // Giftwrap convex hull algorithm. State0 represents the starting state
    // and the last state represents the final convex hull state.
    // Each state is an object with lines and hull attributes. The lines
    // attribute is a list of line objects, each having a points attribute
    // (a list of 2 or more points, each a 2-element [x, y] array) and a
    // style attribute containing Plotly trace attributes.
    //
    function giftWrap(points) {

        var p, pointOnHull, candidate, bottommost = points[0], hull = [], i, j, states = [];

        function pushState(linelist) {
            states.push({lines: linelist, hull: hull.slice()});
        }

        if (points.length < 2) {
            return [];
        }
        for (i = 1; i < points.length; i++) {
            p = points[i];
            if (p[1] < bottommost[1] || (p[1] === bottommost[1] && p[0] < bottommost[0])) {
                bottommost = p;
            }
        }

        hull = [];
        pointOnHull = bottommost;

        while (hull.length < 2 || (hull[0] !== pointOnHull)) {
            hull.push(pointOnHull);
            pushState({points:[], style:{}});
            candidate = null;

            for (j = 0; j < points.length; j++) {
                p = points[j];
                if (p === pointOnHull || p === candidate) continue;
                if (candidate === null) {
                    candidate = p;
                    pushState([{points: [pointOnHull, candidate], style: CANDIDATE_LINE_STYLE}]);
                    continue;
                }
                pushState([
                    {points: [pointOnHull, candidate], style: CANDIDATE_LINE_STYLE},
                    {points: [pointOnHull, p], style: TEST_LINE_STYLE}]);
                if (geom.isCcwA(pointOnHull, p, candidate)) {
                    candidate = p;
                    pushState([{points: [pointOnHull, candidate], style: CANDIDATE_LINE_STYLE}]);
                }
            }
            pointOnHull = candidate;
        }
        hull.push(pointOnHull);  // Close the loop
        pushState([]);
        //hull.pop();
        return states;
    }

    return giftWrap;
});
