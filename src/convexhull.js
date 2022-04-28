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

// The main javascript module for the Giftwrap visualiser.
// Uses the Vue framework.
/* jshint esnext:true */

require(["geom", "plotter", "giftwrap", "grahamscan"], function (geom, plotter, giftwrap, grahamscan) {

    const HULL_LINE_STYLE   = {color: 'red', width: 2, name: 'Convex hull'};
    const HULL_MARKER_STYLE = {color: 'red', size: 15};
    const POINT_SET_STYLE   = {color: 'blue', size: 11};

    const FUNCS = {jarvis: giftwrap, graham: grahamscan };
    const POINT_PLOT_MODES = {jarvis: 'markers+text', graham: 'markers'};
    const LABEL_GRAHAM_SCAN_POINTS = true;

    if (LABEL_GRAHAM_SCAN_POINTS) {
        POINT_PLOT_MODES.graham = 'markers+text';
    }

    var app = new Vue({
        el: '#app',

        data: {
            points: [[30, 70], [40, 11], [96, 22], [16, 88], [54, 97], [83, 35], [44, 45]],
            countString: "5",
            states: [],
            currentStateIndex: 0,
            stateIndexString: '0',
            algorithm: 'jarvis',
            togglefileuploadhelp: false,
        },

        mounted: function() {
            this.start();
        },

        watch: {
            stateIndexString: function() {
                this.currentStateIndex = parseInt(this.stateIndexString);
                this.plot();
            }
        },

        computed: {
            startDisabled: function() { return Boolean(this.points.length === 0); },
            nextDisabled: function() { return Boolean(this.currentStateIndex >= this.states.length - 1); },
            previousDisabled: function() { return Boolean(this.currentStateIndex === 0); },
            statesMax: function() { return this.states.length - 1; }
        },

        methods: {
            // Upload the selected text file of (x, y) data. x, y values should
            // all be integers in the range [0, 100]. Data is extracted with
            // the pattern /[0-9]+/ so any separators can be used but white space
            // or commas are recommended.
            upload: function(event) {
                var rdr = new FileReader(),
                    file = event.target.files[0],
                    that = this;
                rdr.onload = function(evt) {
                    that.clear();
                    var data = evt.target.result,
                        pointStrings = data.match(/[0-9]+/g);
                    for (var i = 0; i < pointStrings.length; i += 2) {
                        that.points.push([parseInt(pointStrings[i]), parseInt(pointStrings[i + 1])]);
                    }
                    that.start();
                };
                rdr.readAsText(file);
            },

            resetfile: function(event) {
                this.$refs.file.value = '';
            },

            clear: function() {
                this.points = [];
                this.states = [];
                this.currentStateIndex = 0;
                this.plot();
            },

            start: function() {
                this.states = FUNCS[this.algorithm](this.points);
                this.currentStateIndex = 0;
                this.plot();
            },

            next: function() {
                this.currentStateIndex += 1;
                this.plot();
            },

            previous: function() {
                this.currentStateIndex -= 1;
                this.plot();
            },

            addPoints: function() {
                // Add however many points is set by the slider
                var x, y, that=this, n = 0;
                function isInPoints(x, y) {
                    // True if (x, y) is in the array points
                    return that.points.find(function (q) {
                        return q[0] == x && q[1] == y;
                    });

                }

                while (n < parseInt(this.countString)) {
                    x = Math.floor(100 * Math.random());
                    y = Math.floor(100 * Math.random());
                    if (!isInPoints(x, y)) {
                        this.points.push([x, y]);
                        n += 1;
                    }
                }
                this.start();
            },

            plot: function () {
                var state, lines, line, mode, labels = [];
                this.stateIndexString = '' + this.currentStateIndex;
                mode = POINT_PLOT_MODES[this.algorithm];
                plotter.plot(this.points, mode, {marker: POINT_SET_STYLE}, true);

                if (this.states.length > 0) {
                    state = this.states[this.currentStateIndex];
                    lines = state.lines;
                    plotter.plot(state.hull, 'lines+markers', {line: HULL_LINE_STYLE, marker: HULL_MARKER_STYLE});

                    for (var i = 0; i < lines.length; i++) {
                        line = lines[i];
                        plotter.plot(line.points, 'lines', {line: line.style});
                    }
                }
            }
        },
    });
});
