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

// The module that plots the Convex Hull as it is being constructed..
// Uses Plotly, which must be loaded by the html.
//
/*jshint esnext: true */

const LABEL_PREFIX = 'p';

define(['geom'], function(geom) {

    function plot(points, mode, traceAttributes, isNew) {
        // Use Plotly to plot the given array of points using the given
        // plotly mode plus additional traceAttributes.
        // Each point can be either a 2-element [x, y] array or a geom.Vec.
        var f = isNew ? Plotly.newPlot : Plotly.plot,
            xs = [],
            ys = [],
            p,
            labels = [],
            trace,
            layout,
            config;

        for(var i = 0; i < points.length; i++) {
            p = points[i];
            if (p instanceof geom.Vec) {
                xs.push(p.x);
                ys.push(p.y);
            } else {
                xs.push(p[0]);
                ys.push(p[1]);
            }
            labels.push(LABEL_PREFIX + i);
        }

        trace = {x: xs, y: ys, mode: mode};
        if (traceAttributes.line && traceAttributes.line.name) {
            trace.name = traceAttributes.line.name;
        } else {
            trace.showlegend = false;
        }
        for (var attr in traceAttributes) {
            trace[attr] = traceAttributes[attr];
        }

        if (mode.includes('text')) {
            trace.text = labels;
            trace.textposition = "middle right";
        }

        layout = {
            xaxis: { title: "x" , range: [-1, 101], scaleanchor: 'y' },
            yaxis: { title: "y" , range: [-1, 101] },
            width: 800,
            height: 800,
            showlegend: true,
            legend: {
                x: 0.3,
                y: 1.05,
                orientation: "h"
            },
            margin: {
                l: 60,
                r: 30,
                b: 60,
                t: 60,
                pad: 0
            },
            font: {size:24}
        };
        config = {
            displayModeBar: false,
            staticPlot: true
        };

        f("convexhull", [trace], layout, config);
    }

    return {
        plot: plot
    };
});
