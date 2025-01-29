import utils

from typing import Any
from django.conf import settings
from django.core.management.base import BaseCommand


STATICFILES_VENDOR_DIR = getattr(settings,'STATICFILES_VENDOR_DIR')
STATICFILES_BASE_DIR = getattr(settings,'STATICFILES_BASE_DIR')

BASE_STATICFILES = {
    "fonts/glyphicons-halflings-regular.eot": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.eot",


    "fonts/glyphicons-halflings-regular.svg": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular",

    "fonts/glyphicons-halflings-regular.ttf": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.ttf",

    "fonts/glyphicons-halflings-regular.woff": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff",

    "fonts/glyphicons-halflings-regular.woff2": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2",

}

VENDOR_STATICFILES = {
    'jquery.js': "https://code.jquery.com/jquery-3.7.1.js",
    "bootstrap-table.min.js": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.1/bootstrap-table.min.js",
    "bootstrap.min.css": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
    "bootstrap.css": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css",
    "bootstrap.css.map": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css.map",
    "bootstrap.min.css.map": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css.map",
    "bootstrap-table.min.css":"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.1/bootstrap-table.min.css",
    "bootstrap-theme.min.css": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css",

    "bootstrap-theme.min.css.map": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css.map",

    "bootstrap.min.js": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",

    "chess.js": "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.2/chess.js",

}

class Command(BaseCommand):

    def handle(self, *args: Any, **options: Any):
        self.stdout.write("Downloading vendor static files")
        completed_urls = []
        for name, url in VENDOR_STATICFILES.items():
            out_path = STATICFILES_VENDOR_DIR / name
            dl_success = utils.download_to_local(url, out_path)
            if dl_success:
                completed_urls.append(url)
            else:
                self.stdout.write(
                    self.style.ERROR(f'Failed to download {url}')
                )
        if set(completed_urls) == set(VENDOR_STATICFILES.values()):
            self.stdout.write(
                self.style.SUCCESS('Successfully updated all vendor static files.')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Some files were not updated.')
            )
        self.stdout.write("Downloading BASE static files")
        completed_urls = []
    
        for name, url in BASE_STATICFILES.items():
            out_path = STATICFILES_BASE_DIR / name
            dl_success = utils.download_to_local(url, out_path)
            if dl_success:
                completed_urls.append(url)
            else:
                self.stdout.write(
                    self.style.ERROR(f'Failed to download {url}')
                )
        if set(completed_urls) == set(BASE_STATICFILES.values()):
            self.stdout.write(
                self.style.SUCCESS('Successfully updated all BASE static files.')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Some files were not updated.')
            )