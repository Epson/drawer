(function() {
    var Spine;
    if ( typeof exports !== "undefined" ) {
        Spine = exports;
    }
    else {
        Spine = this.Spine = {};
    }

    Spine.version = "0.0.3";

    var $ = Spine.$ = this.jQuery || this.Zepto;

    /**
     * (这个函数做什么用的？)
     * @type {Function}
     */
    var makeArray = Spine.makeArray = function(args){
        return Array.prototype.slice.call(args, 0);
    };

    var Events = Spine.Events = {
        /**
         * 将事件添加到事件列表，this._callbacks数组中的每一个元素都是一个函数数组，保存着该事件的所有回调函数。
         *
         * @param   ev              要添加的事件，多个事件之间可用空格分隔。
         * @param   callback        要添加事件的回调函数，该函数会被加入到各个事件对应的this._callbacks元素中。
         * @return  this            返回调用当前函数的对象，以实现链式调用。
         */
        bind: function(ev, callback) {
            var evs   = ev.split(" ");
            var calls = this._callbacks || (this._callbacks = {});

            //遍历事件列表，并往相应事件的回调函数列表中添加函数
            for (var i=0; i < evs.length; i++)
                (this._callbacks[evs[i]] || (this._callbacks[evs[i]] = [])).push(callback);

            return this;
        },

        /**
         *
         * @return {*}
         */
        trigger: function() {
            var args = makeArray(arguments);
            var ev   = args.shift();

            var list, calls, i, l;
            if (!(calls = this._callbacks)) return this;
            if (!(list  = this._callbacks[ev])) return this;

            for (i = 0, l = list.length; i < l; i++)
                if (list[i].apply(this, args) === false)
                    return false;
            return this;
        },

        /**
         * 从事件列表中删除某些已绑定的事件的回调函数，当不调用任何参数时即为删除所有事件的回调函数
         *
         * @param   ev          要解除绑定的事件，一次只能对一个事件解除绑定
         * @param   callback    要从事件上解除绑定的回调函数，一次只能对事件上的一个回调函数解除绑定
         * @return  this        返回调用当前函数的对象，以实现链式调用
         */
        unbind: function(ev, callback){
            //当参数列表为空时默认清除所有事件
            if ( !ev ) {
                this._callbacks = {};
                return this;
            }

            //用局部变量calls和list来保存事件列表和对应事件的回调函数列表，若有一个为空则说明该事件不存在，删除操作不必再继续进行。
            var list, calls, i, l;
            if (!(calls = this._callbacks)) return this;
            if (!(list  = this._callbacks[ev])) return this;

            //遍历该事件的回调函数列表，若发现有与参数callback相同的回调函数则将其删去
            for (i = 0, l = list.length; i < l; i++) {
                if (callback === list[i]) {
                    list.splice(i, 1);
                    break;
                }
            }

            return this;
        }
    };

    var Log = Spine.Log = {
        trace: true,

        logPrefix: "(App)",

        log: function(){
            if ( !this.trace ) return;
            if (typeof console == "undefined") return;
            var args = makeArray(arguments);
            if (this.logPrefix) args.unshift(this.logPrefix);
            console.log.apply(console, args);
            return this;
        }
    };

    // Classes (or prototypial inheritors)
    //若create方法不存在则重写该方法，用原型链实现类的继承
    if (typeof Object.create !== "function")
        Object.create = function(o) {
            function F() {};
            F.prototype = o;
            return new F();
        };

    var moduleKeywords = ["included", "extended"];

    //Spine.js中的类机制
    var Class = Spine.Class = {
        inherited: function(){},    //回调函数，当有类被继承时就会触发该函数
        created: function(){},      //回调函数，当有类被构造时就会触发该函数

        prototype: {
            initializer: function(){},
            init: function(){}
        },

        //构造一个类，所有的类都继承自Spine.Class
        create: function(include, extend){
            //创建一个继承自Spine.Class的类
            var object = Object.create(this);       //这一步返回一个继承自Spine.Class的类（对象）
            object.parent    = this;                //将该对象的parent属性显式地设置为Spine.Class对象，以表示其继承自Spine.Class`
            object.prototype = object.fn = Object.create(this.prototype);

            //向该类中添加模块（实例属性和类属性）
            if (include) object.include(include);
            if (extend)  object.extend(extend);

            //触发类被创建时的回调函数和类被继承时的回调函数
            object.created();
            this.inherited(object);
            return object;
        },

        //实例化一个对象
        init: function(){
            var initance = Object.create(this.prototype);
            initance.parent = this;

            initance.initializer.apply(initance, arguments);    //这里的arguments是参数列表，当有参数传入时就可用来对实例对象进行初始化操作
            initance.init.apply(initance, arguments);
            return initance;
        },

        //设置代理函数，以保证需要的函数在正确的上下文中执行。有些回调函数的会出现上下文改变导致运行出错的问题。
        proxy: function(func){
            var thisObject = this;  //将当前上下文绑定到一个局部对象上，然后将这个局部对象作为执行上下文传给要执行的函数
            return(function(){
                return func.apply(thisObject, arguments);
            });
        },

        //为所有的回调函数执行代理，指定执行的上下文。
        proxyAll: function(){
            var functions = makeArray(arguments);
            for (var i=0; i < functions.length; i++)
                this[functions[i]] = this.proxy(this[functions[i]]);
        },

        //为类添加原型属性和方法，所有由该类创建的实例对象都会共享一份这样的原型属性和方法
        include: function(obj){
            for(var key in obj)
                if (moduleKeywords.indexOf(key) == -1)
                    this.fn[key] = obj[key];

            //触发模块被包含时的回调函数
            var included = obj.included;
            if (included) included.apply(this);
            return this;
        },

        //为类添加静态类属性和方法，该属性和方法只能在类层次上调用
        extend: function(obj){
            for(var key in obj)
                if (moduleKeywords.indexOf(key) == -1)
                    this[key] = obj[key];

            //触发模块被包含时的回调函数
            var extended = obj.extended;
            if (extended) extended.apply(this);
            return this;
        }
    };

    Class.prototype.proxy    = Class.proxy;
    Class.prototype.proxyAll = Class.proxyAll;
    Class.inst               = Class.init;

    // Models

    //为每条记录生成一个id（如何保证是独一无二的？）
    Spine.guid = function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }).toUpperCase();
    };

    //Model类继承自Spine.Class
    var Model = Spine.Model = Class.create();

    //为Model类添加事件模块
    Model.extend(Events);

    // Alias create
    Model.createSub = Model.create;         //将原型属性转化成对象属性，避免查找原型链的开销

    /**
     * 创建新模型对象
     *
     * @param name      新模型的名字
     * @param atts      新模型具有的属性
     * @return {*}
     */
    Model.setup = function(name, atts){
        var model = Model.createSub();
        if (name) model.name = name;
        if (atts) model.attributes = atts;
        return model;
    };

    //向模型类中添加扩展模块
    Model.extend({
        /**
         * 创建记录
         *
         * @param sub
         */
        created: function(sub){
            this.records = {};
            this.attributes = [];

            this.bind("create",  this.proxy(function(record){
                this.trigger("change", "create", record);
            }));
            this.bind("update",  this.proxy(function(record){
                this.trigger("change", "update", record);
            }));
            this.bind("destroy", this.proxy(function(record){
                this.trigger("change", "destroy", record);
            }));
        },

        /**
         * 根据id查找相应的记录
         *
         * @param id        要查找的记录的id
         * @return {*}
         */
        find: function(id){
            var record = this.records[id];
            if ( !record ) throw("Unknown record");
            return record.dup();
        },

        /**
         * 判断一条记录是否存在
         *
         * @param   id      要判断的记录的id
         * @return  false   当该记录不存在时将被返回
         */
        exists: function(id){
            try {
                return this.find(id);
            } catch (e) {
                return false;
            }
        },

        /**
         * 用一个新的记录数组更新当前的所有记录
         *
         * @param values    一个包含着多条记录的数组
         */
        refresh: function(values){
            this.records = {};

            for (var i=0, il = values.length; i < il; i++) {
                var record = this.init(values[i]);
                record.newRecord = false;
                this.records[record.id] = record;
            }

            this.trigger("refresh");
        },

        /**
         * 根据自定义的条件从记录列表中选择相应的记录
         *
         * @param   callback    自定义记录选择条件的函数
         * @return  {*}
         */
        select: function(callback){
            var result = [];

            for (var key in this.records)
                if (callback(this.records[key]))
                    result.push(this.records[key]);

            return this.dupArray(result);
        },

        /**
         * 根据某个属性的值来选择相应的记录，若有多条记录符合条件则只返回找到的第一条记录
         *
         * @param name      要判断的属性名称
         * @param value     符合要求的属性值
         * @return {*}
         */
        findByAttribute: function(name, value){
            for (var key in this.records)
                if (this.records[key][name] == value)
                    return this.records[key].dup();
        },

        /**
         * 根据某个属性的值来选择相应的记录，所有符合条件的记录都会被返回
         *
         * @param name      要查找的属性名称
         * @param value     符合要求的属性值
         * @return {*}
         */
        findAllByAttribute: function(name, value){
            return(this.select(function(item){
                return(item[name] == value);
            }));
        },

        /**
         * 对所有记录都调用一个回调函数
         *
         * @param callback      要使用的回调函数
         */
        each: function(callback){
            for (var key in this.records)
                callback(this.records[key]);
        },

        all: function(){
            return this.dupArray(this.recordsValues());
        },

        /**
         * 返回第一条记录
         *
         * @return {*}
         */
        first: function(){
            var record = this.recordsValues()[0];
            return(record && record.dup());
        },

        /**
         * 返回最后一条记录
         *
         * @return {*}
         */
        last: function(){
            var values = this.recordsValues()
            var record = values[values.length - 1];
            return(record && record.dup());
        },

        /**
         * 返回记录的条数
         *
         * @return {*}
         */
        count: function(){
            return this.recordsValues().length;
        },

        /**
         * 删除所有的记录
         */
        deleteAll: function(){
            for (var key in this.records)
                delete this.records[key];
        },

        /**
         * (destroy 和 delete 有什么区别？)
         */
        destroyAll: function(){
            for (var key in this.records)
                this.records[key].destroy();
        },

        /**
         * 根据id更改相应记录的值
         *
         * @param   id      要更改的记录的id
         * @param   atts    要更改的记录的属性值
         */
        update: function(id, atts){
            this.find(id).updateAttributes(atts);
        },

        create: function(atts){
            var record = this.init(atts);
            record.save();
            return record;
        },

        destroy: function(id){
            this.find(id).destroy();
        },

        sync: function(callback){
            this.bind("change", callback);
        },

        fetch: function(callback){
            callback ? this.bind("fetch", callback) : this.trigger("fetch");
        },

        toJSON: function(){
            return this.recordsValues();
        },

        // Private

        recordsValues: function(){
            var result = [];
            for (var key in this.records)
                result.push(this.records[key]);
            return result;
        },

        dupArray: function(array){
            var result = [];
            for (var i=0; i < array.length; i++)
                result.push(array[i].dup());
            return result;
        }
    });

    Model.include({
        model: true,
        newRecord: true,        //(这个属性有什么用处?)

        /**
         * 使用给定的属性名称和属性值对当前记录进行初始化
         *
         * @param   atts      一个包含有给定属性名称和属性值的数组
         */
        init: function(atts){
            if (atts) this.load(atts);
        },

        /**
         * 判断一条记录是否是新创建的
         *
         * @return  true        当为新记录时被返回
         *          false       当不为新记录时被返回
         */
        isNew: function(){
            return this.newRecord;
        },

        validate: function(){ },

        /**
         * 向一条记录添加多条属性
         *
         * @param   atts        一个保存着多个属性的名称和值的数组
         */
        load: function(atts){
            for(var name in atts)
                this[name] = atts[name];
        },

        /**
         * 返回具有该记录的所有属性值的一个拷贝
         *
         * @return  result      一个具有当前记录的id及所有属性值的对象
         */
        attributes: function(){
            var result = {};
            for (var i=0; i < this.parent.attributes.length; i++) {
                var attr = this.parent.attributes[i];
                result[attr] = this[attr];
            }
            result.id = this.id;
            return result;
        },

        /**
         * 比较两条记录是不是相同，相同的条件为两条记录的id相同且是同一种模型的记录
         *
         * @param   rec         要与当前记录做判断的记录
         * @return  true        当两条记录是相同的时候被返回
         *          false       当两条记录不相同时被返回
         */
        eql: function(rec){
            return(rec && rec.id === this.id &&
                rec.parent === this.parent);
        },

        /**
         *
         */
        save: function(){
            var error = this.validate();
            if (error) {
                if ( !this.trigger("error", error) )
                    throw("Validation failed: " + error);
            }

            this.trigger("beforeSave");
            this.newRecord ? this.create() : this.update();
            this.trigger("save");
        },

        /**
         * 根据属性名称更新当前记录相应属性的值
         *
         * @param   name        要更新的属性名称
         * @param   value       要更新的属性值
         * @return  {*}
         */
        updateAttribute: function(name, value){
            this[name] = value;
            return this.save();
        },

        /**
         * 使用一个包含着多个属性值的数组更新当前记录的多个相应属性的值
         *
         * @param   atts        包含着多个属性值的数组
         * @return  {*}
         */
        updateAttributes: function(atts){
            this.load(atts);
            return this.save();
        },

        /**
         * 从相应的模型类的记录列表中删除当前记录
         */
        destroy: function(){
            this.trigger("beforeDestroy");
            delete this.parent.records[this.id];
            this.trigger("destroy");
        },

        /**
         * 返回当前记录的一个拷贝
         *
         * @return  result      一个新对象，它是一个包含着当前记录所有属性值的拷贝
         */
        dup: function(){
            var result = this.parent.init(this.attributes());
            result.newRecord = this.newRecord;
            return result;
        },

        /**
         * 返回当前记录的一个引用
         *
         * @return  {Object}    一个引用指向对应模型类的记录列表中的当前记录
         */
        reload: function(){
            return(this.parent.find(this.id));
        },

        /**
         * 将当前记录的所有属性以json的形式表现
         *
         * @return  result      一个具有当前记录所有属性名称和对应属性值的临时对象
         */
        toJSON: function(){
            return(this.attributes());
        },

        /**
         * 查看当前记录是否存在于对应的模型类的记录列表中
         *
         * @return  true        当记录存在时被返回
         *          false       当记录不存在时被返回
         */
        exists: function(){
            return(this.id && this.id in this.parent.records);
        },

        // Private

        /**
         * 将当前记录更新到对应模版类的记录列表中
         */
        update: function(){
            this.trigger("beforeUpdate");
            this.parent.records[this.id] = this.dup();
            this.trigger("update");
        },

        /**
         * 创建一条新记录，为其生成新的id，并将其添加到对应模板类的记录列表中
         */
        create: function(){
            this.trigger("beforeCreate");
            if ( !this.id ) this.id = Spine.guid();
            this.newRecord = false;
            this.parent.records[this.id] = this.dup();
            this.trigger("create");
        },

        /**
         * 在当前记录上绑定事件
         *
         * @param   events      要绑定的事件名称
         * @param   callback    该事件触发后的回调函数
         */
        bind: function(events, callback){
            this.parent.bind(events, this.proxy(function(record){
                if ( record && this.eql(record) )
                    callback.apply(this, arguments);
            }));
        },

        trigger: function(events){
            var args = makeArray(arguments);
            args.splice(1, 0, this);
            this.parent.trigger.apply(this.parent, args);
        }
    });

    // Controllers
    var eventSplitter = /^(\w+)\s*(.*)$/;

    var Controller = Spine.Controller = Class.create({
        tag: "div",

        initializer: function(options){
            this.options = options;

            for (var key in this.options)
                this[key] = this.options[key];

            if (!this.el) this.el = document.createElement(this.tag);
            this.el = $(this.el);

            if ( !this.events ) this.events = this.parent.events;
            if ( !this.elements ) this.elements = this.parent.elements;

            if (this.events) this.delegateEvents();
            if (this.elements) this.refreshElements();
            if (this.proxied) this.proxyAll.apply(this, this.proxied);
        },

        $: function(selector){
            return $(selector, this.el);
        },

        delegateEvents: function(){
            for (var key in this.events) {
                var methodName = this.events[key];
                var method     = this.proxy(this[methodName]);

                var match      = key.match(eventSplitter);
                var eventName  = match[1], selector = match[2];

                if (selector === '') {
                    this.el.bind(eventName, method);
                } else {
                    this.el.delegate(selector, eventName, method);
                }
            }
        },

        refreshElements: function(){
            for (var key in this.elements) {
                this[this.elements[key]] = this.$(key);
            }
        },

        delay: function(func, timeout){
            setTimeout(this.proxy(func), timeout || 0);
        }
    });

    Controller.include(Events);
    Controller.include(Log);

    Spine.App = Controller.create({
        create: function(properties){
            this.parent.include(properties);
            return this;
        }
    }).init();
    Controller.fn.App = Spine.App;
})();