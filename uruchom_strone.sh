#!/usr/bin/env bash
# Skrypt uruchamiający stronę poświęconą Janowi Surzyckiemu
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "=========================================================="
echo "  PORTAL PAMIĘCI JANA SURZYCKIEGO (1898-1921)"
echo "=========================================================="
echo "Otwieranie strony w domyślnej przeglądarce..."

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$DIR/index.html"
elif command -v google-chrome >/dev/null 2>&1; then
    google-chrome "$DIR/index.html"
elif command -v firefox >/dev/null 2>&1; then
    firefox "$DIR/index.html"
else
    echo "Otwórz plik ręcznie w przeglądarce: $DIR/index.html"
fi

echo "Gotowe!"
