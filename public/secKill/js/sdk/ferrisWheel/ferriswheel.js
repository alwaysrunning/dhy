/**
 * Created by 沐沐 on 2015-03-25.
 * 摩天轮模块
 */
YunHouSDK.register('sdk.ferrisWheel.main',function () {
    var sdk = this;
    return function (pointer,awardPool) {
        var awards = [];
        var awardGroup = {};

        var initAwardPool = function(){
            if(sdk.tools.isArray(awardPool)){
                var len = awardPool.length;
                var perDeg = 360 / len;
                var firstDeg = 0;
                awards = awardPool.map(function(per,i){
                    return {
                        award : per,
                        deg: firstDeg - perDeg * i
                    }
                });
                awards.forEach(function(e){
                    awardGroup[e.award] = awardGroup[e.award] || [];
                    awardGroup[e.award].push(e);
                });
            }
        };
        //var randomBetween = function(n,m){
        //    var w = m-n;
        //    return Math.round(Math.random()*w + n);
        //};
        initAwardPool();

        return {
            pointTo:function(awardName,afterPoint){
                if(!$(pointer).hasClass('rotating') && !$(pointer).hasClass('resetting')){
                    var self = this;
                    var randomCircle = sdk.tools.randomBetween(3,4);
                    var randomCircleDeg = randomCircle * 360;
                    var awardInGroup = awardGroup[awardName];
                    var finalAward = awardInGroup[sdk.tools.randomBetween(0,awardInGroup.length - 1)];
                    this.finalDeg = randomCircleDeg + finalAward.deg;

                    $(pointer).addClass('rotating').addClass('rotated').css({
                        'transform': 'rotate('+this.finalDeg + 'deg)',
                        '-webkit-transform': 'rotate('+this.finalDeg + 'deg)'
                    });


                    //$(pointer).addClass('rotating').addClass('rotated').animate({
                    //    rotate: this.finalDeg + 'deg'
                    //},3000,'ease',function(){
                    //    $(pointer).removeClass('rotating');
                    //    self.pointReset();
                    //});

                    setTimeout(function(){
                        $(pointer).removeClass('rotating');
                        self.pointReset();
                        if(typeof afterPoint == 'function'){
                            afterPoint();
                        }
                    },3100);

                }
                return this;
            },
            pointReset:function(){
                //if(!$(pointer).hasClass('rotating') && !$(pointer).hasClass('resetting')) {
                    var minSameDeg = this.finalDeg % 360;
                    $(pointer).addClass('resetting').css({
                        'transform': 'rotate(' + minSameDeg + 'deg)',
                        '-webkit-transform': 'rotate(' + minSameDeg + 'deg)'
                    }).removeClass('resetting').removeClass('rotated');

                //}
                return this;
            },
            randomPoint:function(){
                if(!$(pointer).hasClass('rotated') && !$(pointer).hasClass('rotating') && !$(pointer).hasClass('resetting')) {
                    var awardGroupNames = Object.keys(awardGroup);
                    var randomName = awardGroupNames[sdk.tools.randomBetween(0, awardGroupNames.length - 1)];
                    this.pointTo(randomName);
                    console.log('本次摇出的是：' + randomName);
                }
                return this;
            }
        };
    }
});