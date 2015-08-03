# Backbone.Coool

Backbone.Coool is a modular set of extensions for Backbone.
It steals a lot of neat ideas from [Backbone.NestedTypes](http://volicon.github.io/backbone.nestedTypes/#getting-started) and implements them mostly using mixins (see [cocktail.js](https://github.com/onsi/cocktail)).

## Features

+ Everything is a plugin! - only use what you need, when you need it.
+ Use traits to extend Backbone with your own development style.
+ Create your own attribute types, or extend builtin attributes.
+ Helpful builtin traits & types to handle model relations, properties, enums, etc...

## Core

At its core Backbone.Coool has 2 concepts:

### 1. trait

A trait is basically a cocktail.js mixin with an (optional) static section.
        Most of the functionality provided by Coool is implemented with traits.

Any Class that is defined by Coool can be extended with traits, simply by passing the "traits" property.
here's a simple example on how to define and use traits:


            // a trait is just a simple JS object
            var MyUselessTrait = {
             static : {
                    otherThing : function() { console.log("other thing...") }
                    staticName : "mooo"
             }

                sayBlah : function() { console.log("blah!")},
                name : "an object"
            }

            // usage:
            // we use a model as an example, but really any class can be decorated with traits :)
            var MyModel = Coool.Model.extend({ traits : [MyUselessTrait]});
            var model = new MyModel();

            model.sayBlah(); // will print "blah!"
            model.name; // "an object"

            MyModel.otherThing(); // will print "other thing..."
            MyModel.staticName; // "mooo"


### 2. Coool.Attribute

Most of the time you can get away just fine with having simple model attribute types in your Backbone Model.
But some times you do have more complex types, for example we had to deal a lot with temperature, model relations,
enums etc...

In this case it makes a lot of sense to reuse all the serialization/deserialization code on a per attribute basses.
So we made attribute into an object! check this example:

    var Tuple = Coool.type.Tuple;
    var MyModel = Coool.Model.extend({
        defaults : {
            simple : true, // simple attributes are still supported
            name : Coool.Attribute({ default : "mooo"}), // will behave like a simple attribute
            tuple : Tuple.defaultsTo([1,2,3]) // tuple is basically a frozen array
        }
    });

    var my = new MyModel();

    my.get("simple") // true
    my.get("name") // moo

    my.get("tuple") // [1,2,3]
    Object.isFrozen(my.get("tuple")); // true


## Other small improvements:

1. this._super() is back :)
   no more this.constructor.prototype.methodName.call... ugly hacks!


    var My = Coool.Attribute.extend({
        get : function() {
            return this._super(); // will call Attribute.prototype.get...
        }
    })


2. Model "defaults" inheritance, e,g:

        var Parent = Coool.Model.extend({ defaults : { fromParent : 42}});
        var Child = Parent.extend({ defaults : { fromChild : 123}});
        ....
        var model = new Child();
        model.get("fromParent"); // 42

3. Class is a thing (and can also be extended with traits):

        var MyThing = Coool.Class.extend({
            initialize : function() {console.log(":)"); }
        });

        new MyThing(); // :)


## Attribute API
TODO

## trait API
TODO

## Custom builds

At this time there is no auto build script to build minimal version, mainly because I'm too lazy :P

But it's fairly easy to customize the build, by simply editing "src/Coool.js"... just remove all the
stuff you don't want and run "grunt build", then check the dist directory :)
