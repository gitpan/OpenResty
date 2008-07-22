package OpenResty::PLPerl;

use strict;
use warnings;

use base 'OpenResty';

sub response {
    my $self = shift;
    if ($self->{_no_response}) { return undef; }

    my $cookie_data = $self->{_cookie};
    my @cookies;
    if ($cookie_data) {
        while (my ($key, $val) = each %$cookie_data) {
            push @cookies, CGI::Simple::Cookie->new(
                -name => $key, -value => $val
            );
        }
    }

    #print "HTTP/1.1 200 OK\n";
    #warn $s;
    if (my $bin_data = $self->{_bin_data}) {
        return "BINARY DATA";
    }
    my $str;
    if (my $error = $self->{_error}) {
        $str = $self->emit_error($error);
    } elsif (my $data = $self->{_data}) {
        if ($self->{_warning}) {
            $data->{warning} = $self->{_warning};
        }
        $str = $data;
    }

    if (my $var = $self->{_var} and $Dumper eq $ext2dumper{'.js'}) {
        $str = "$var=$str;";
    } elsif (my $callback = $self->{_callback} and $Dumper eq $ext2dumper{'.js'}) {
        $str = "$callback($str);";
    }
    $str =~ s/\n+$//s;

    my $last_res_id = $cgi->url_param('last_response');
    ### $last_res_id;
    ### $meth;
    if (defined $last_res_id) {
        #warn "!!!!!!!!!!!!!!!!!!!!!!!!!!wdy!";
        $Cache->set_last_res($last_res_id, $str);
    }

    return $str;
}

sub emit_data {
    my ($self, $data) = @_;
    #warn "$data";
    return $data;
}

1;
__END__

=head1 NAME

OpenResty::Inlined - OpenResty app class for inlined REST requrests

