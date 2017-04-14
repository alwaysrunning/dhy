/**
 * Created by 沐沐 on 2016-01-07.
 */
var posCalculator = function () {
    var posArray = [];
    var ruleArray = [];
    var limit = 0;
    var real = 0;

    var cal = function () {
        var posTotal = 0, total = 0;

        if (ruleArray.length != 0) {
            $(posArray).each(function (i, pos) {
                posTotal += pos.xsje;
            });

            var useRule, maxAmount = 0;
            $(ruleArray).each(function (i, rule) {
                if (rule.money !== 0) {
                    if (posTotal >= rule.startAmount) {
                        useRule = rule;
                        maxAmount = rule.endAmount;
                    }
                }
            });
            if (useRule) {
                if (posTotal >= maxAmount) {
                    total = limit;
                } else {
                    total = useRule.money;
                }
                if (total > real) {
                    total = real;
                }
            }
        }
        return total;
    };

    var getRuleText = function () {
        var ruleTextArray = [];
        $(ruleArray).each(function (i, rule) {
            ruleTextArray.push('满' + rule.startAmount + '抵' + (rule.money / 100));
            if (i === ruleArray.length - 1) {
                ruleTextArray.push('满' + rule.endAmount + '抵' + (limit / 100) + '（封顶）');
            }
        });
        return ruleTextArray.join('，');
    };

    var samePos = function (pos) {
        var posCode = pos.parkno || pos;
        var find = false;

        $(posArray).each(function (i, posItem) {
            if (posItem.parkno == posCode) {
                find = true;
                return false;
            }
        });

        return find;
    };

    var add = function (pos) {
        if (!samePos(pos)) {
            posArray.push(pos);
            $(output).trigger('added', pos);
        }
    };

    var del = function (pos) {
        $(posArray).each(function (i, posItem) {
            if (posItem.parkno == pos) {
                var posDel = posArray.splice(i, 1);
                $(output).trigger('deled', posDel);
                return false;
            }
        });
    };

    var getPoss = function () {
        var discount = cal();
        if (posArray.length > 0 && discount === 0) {
            return false;
        }
        return posArray.map(function (pos) {
            return pos.parkno
        }).join(',');
    };

    var init = function (poss, rules, _limit, _real) {
        posArray = poss;
        ruleArray = rules;
        limit = _limit;
        real = _real;
        return output;
    };

    var output = {
        init: init,
        add: add,
        del: del,
        cal: cal,
        ruleText: getRuleText,
        samePos: samePos,
        getParam: function (carNo) {
            var posMoney = cal();
            var poss = getPoss();
            var param = {
                carNo: carNo,
                money: real,
                posMoney: posMoney,
                weixinMoney: real - posMoney
            };

            poss && (param['parkno'] = poss);
            return param;
        },
        real: function () {
            return real;
        },
        hasPos: function () {
            return posArray.length > 0;
        }
    };

    return output;
};