use lib 'lib';
use strict;
use warnings;

use WWW::OpenAPI;

my $openapi = WWW::OpenAPI->new({ server => 'http://localhost' });
my $res = $openapi->login('carrie', 'zhxj1984');
if ($res->is_success) {
    print $res->content;
} else {
    eie $res->status_line;
}
$openapi->delete('/=/model/YisouComments');
$res = $openapi->post(<<'_EOC_', '/=/model/~');
{"columns":[{"name":"id","label":"ID","type":"serial"},{"name":"content","default":null,"label":"content","type":"text"},{"name":"posturl","default":null,"label":"posturl","type":"text"},{"name":"created","default":["now()"],"label":"created","type":"timestamp"},{"name":"updated","default":["now()"],"label":"updated","type":"date"},{"name":"title","default":null,"label":"title","type":"text"},{"name":"owner","default":null,"label":"owner","type":"text"},{"name":"host","default":null,"label":"host","type":"text"},{"name":"parentid","default":null,"label":"parentid","type":"integer"},{"name":"picurl","default":null,"label":"picurl","type":"text"},{"name":"children","default":"0","label":"children number","type":"integer"},{"name":"support","default":"0","label":"support score","type":"integer"},{"name":"deny","default":"0","label":"deny score","type":"integer"},{"name":"video","default":null,"label":"video url address","type":"text"},{"name":"img","default":null,"label":"img url address","type":"text"}],"name":"YisouComments","description":"YisouComments"}
_EOC_
if ($res->is_success) {
    print $res->content;
} else {
    die $res->status_line;
}

