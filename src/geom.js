/* jshint esnext:true */
define([], function() {
    /*********************************************************
     *
     * Define the class Vec, representing a 2D point/vector.
     *
     *********************************************************/
    function Vec(x, y) {
        if (y === undefined) {
            this.x = x[0];
            this.y = x[1];
        } else {
            this.x = x;
            this.y = y;
        }
    }

    // Vector addition
    Vec.prototype.plus = function(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    };

    // Vector subtraction
    Vec.prototype.minus = function(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    };

    // Vector dot product
    Vec.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y;
    };

    // Return true iff the turn direction from self to other is CCW
    Vec.prototype.isLeftTurn = function(other) {
        var area = this.x * other.y - other.x * this.y;
        return area > 0;
    };

    Vec.prototype.isParallel = function(other) {
        var area = this.x * other.y - other.x * this.y;
        return Boolean(area === 0);
    };

    Vec.prototype.lensq = function() {
        return this.dot(this);
    };

    // True if triangle p0, p1, p2 has vertices in counter-clockwise order.
    // p0, p1, p2 must be Vecs.
    function isCcw(p0, p1, p2) {
        return p1.minus(p0).isLeftTurn(p2.minus(p0));
    }

    // True if triangle p0, p1, p2 has vertices in counter-clockwise order.
    // p0, p1, p2 are arrays.
    function isCcwA(p0A, p1A, p2A) {
        var p0 = new Vec(p0A[0], p0A[1]),
            p1 = new Vec(p1A[0], p1A[1]),
            p2 = new Vec(p2A[0], p2A[1]);
        return isCcw(p0, p1, p2);
    }

    return {
        Vec: Vec,
        isCcw: isCcw,
        isCcwA: isCcwA
    };

});

