from django import template

register = template.Library()

@register.filter(name='in_list')
def in_list(value, arg):
    """Check if value is in a comma-separated list."""
    return value in [x.strip() for x in arg.split(',')]