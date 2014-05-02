invite
======

Learning how to use Parse and Backbone.

This is a work in progress; I am blogging about the experience [here](http://fatchat121.blogspot.com/2014/04/writing-small-application-using-parse.html)

**Get, Build, Run**

    git clone https://github.com/fatchat/invite.git
    npm install
    bower install
    grunt serve

Okay, not quite. You need an `auth_keys.js` in your `app/` folder, which should look like this:

```
auth_keys = {
	PARSE_APP_ID		: "<>",
	PARSE_JAVSCRIPT_KEY	: "<>",
	FACEBOOK_APP_ID		: "<>"
};
```

except with actual values which you need to get from Facebook and from Parse. 
