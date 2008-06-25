use strict;
use warnings;

#use Smart::Comments;
use lib 'lib';
use OpenResty::RestyScript::View;

sub quote {
    my $s = shift;
    if (!defined $s) { $s = '' }
    $s =~ s/\n/{NEW_LINE}/g;
    $s =~ s/\r/{RETURN}/g;
    $s =~ s/\t/{TAB}/g;
    '$y$' . $s . '$y$';
}

sub quote_ident {
    qq/"$_[0]"/
}


local $/;
my $sql = <>;
my $select = OpenResty::RestyScript::View->new;
my $res = $select->parse(
    $sql,
    {
        quote => \&quote,
        quote_ident => \&quote_ident,
        vars => {},
    }
);

