Number.prototype.NumPlus = function (param) {
    var p = this;
    var r1, r2, m;
    try {
        r1 = p.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = param.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));

    return (p * m + param * m) / m;
}
Number.prototype.NumSub = function (param) {
    var p = this;
    var r1, r2, m;
    try {
        r1 = p.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = param.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));

    return (p * m - param * m) / m;
}
Number.prototype.NumMul = function (param) {
    var p = this;
    var r1, r2, m;
    try {
        r1 = p.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = param.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));

    return (p * m * param) / m;
}
Number.prototype.NumDiv = function (param) {
    var p = this;
    var r1, r2, m;
    try {
        r1 = p.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = param.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));

    return (p * m / param) / m;
}
