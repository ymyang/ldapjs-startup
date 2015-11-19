/**
 * Created by yang on 2015/6/4.
 */
var ldap = require('ldapjs');

var client = ldap.createClient({
    url: 'ldap://192.168.1.81:389',
    //maxConnections: 5,
    bindDN: 'administrator@ad.yliyun.com',
    bindCredentials: 'yliyun@123'
    //checkInterval: 30000,
    //maxIdleTime: 60000
});

_bind();

//_getUser();

function _bind() {
    client.bind('ymyangw@ad.yliyun.com', 'yliyun@123', function(err) {
        if (err) {
            console.error(JSON.stringify(err));
        }
        client.unbind();
        console.log('bind ok');
    });
}

function _getOu() {
    var options = {
        scope: 'one',
        filter: '(objectclass=organizationalUnit)',
        //sizeLimit: 2,
        paged: true
        //paged: {
        //    pageSize: 1
        //}
    };
    _search(options);
}

function _getUser() {
    var options = {
        scope: 'sub',
        //sizeLimit: 5000,
        filter: '(&(objectclass=user)(!(objectclass=computer)))'
    };
    _search(options);
}

function _getGroup() {
    var options = {
        scope: 'sub',
        filter: '(objectclass=group)'
    };
    _search(options);
}

function _search(options) {
    client.search('dc=ad,dc=yliyun,dc=com', options, function(err, res){
        if (err) {
            console.error(err);
        }
        var count = 0;
        res.on('searchEntry', function(entry) {
            console.log('entry: ' + JSON.stringify(entry.object));
            count ++;
        });
        res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
            console.log('count:', count);
        });
        res.on('error', function(err) {
            console.error('error: ' + err);
            console.log('count:', count);
        });
        //res.on('page', function(result) {
        //    console.log('page end');
        //});
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            console.log('count:', count);
        });
    });
}

//client.unbind();
//client.destroy({});