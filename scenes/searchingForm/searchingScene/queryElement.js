/**
 * 查询场景使用的查询条件元素
 * 抽象基类
 * 继承自Cell
 */
(function(cellula){
    var UtilTools = cellula._util;
    cellula.QueryElement = new cellula.Class('QueryElement',{
        //细胞核存放数据
        nucleus:null,
        init : function (cfg) {
            if (UtilTools.isObject(cfg)) {
                for (var n in this) {
                    UtilTools.isObject(this[n]) && UtilTools.isObject(cfg[n]) ? this[n] = UtilTools.deepMix({},this[n],cfg[n]): this[n] = cfg[n] ? cfg[n] : this[n];
                }
            }
            this.render();
            this.nucleus.on('error',this.error,this)
        }

    }).inherits(cellula.Cell);

    cellula.QueryElement.Input = new cellula.Class('QueryElement.Input',{
        formExplain:'请填写',
        render:function(){
            this._super();
            var input =  $(this.rootNode).find('input').get(0);
            var inputElV =  input.value;
            if(inputElV) this.nucleus.set('value',inputElV);
            var inputV = this.nucleus.get('value');
            input.value = (inputV)?inputV:'';
        },
        registerEvents:function(){
            var that = this;
            $(this.rootNode).find('input').blur(function(e){
                that.nucleus.set('value',this.value);
            });
            $(this.rootNode).find('input').focus(function(e){
               that.clearErrorState();
            });
        },
        error:function(errMsg){
            $(this.rootNode).addClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML = errMsg;
        },
        clearErrorState:function(){
            $(this.rootNode).removeClass('mi-form-item-error');
            $(this.rootNode).find('.mi-form-explain').get(0).innerHTML =this.formExplain;
        }
    }).inherits(cellula.QueryElement);
})(Cellula);


/**
 * 查询元素产出工厂
 * @param typeClass
 * @param nucleus
 */
var QueryElementFactory = function (elements) {
    if (!Cellula._util.isArray(elements)) {
        elements = [elements];
    }
    var result = [];
    Cellula._util.each(elements,function(item,index){
        if(item.key && item.classType && item.rootNode){
            var tmpNuCl = new Cellula.Class(item.key,{
                validate:(item.validate)?item.validate:function(){}
            }).inherits(Cellula.Nucleus);
            item.nucleus = new tmpNuCl({value:item.value});
            var tmp = new item.classType(item);
            result.push(tmp);
        }
    })
    return result;
};