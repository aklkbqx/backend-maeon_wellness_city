rm -f /tmp/.X99-lock
rm -f /tmp/.X11-unix/X99

Xvfb :99 -screen 0 1280x1024x24 &
sleep 2

export DISPLAY=:99

touch ~/.Xauthority
xauth generate :99 . trusted

fluxbox &
sleep 2

pkill x11vnc || true
sleep 1

x11vnc -display :99 -forever -shared -nopw -listen localhost &
sleep 2

websockify --web /usr/share/novnc 6080 localhost:5900 &
sleep 2

echo "All services started:"
echo "- Xvfb on display :99"
echo "- VNC server on port 5900"
echo "- noVNC on port 6080"
echo "Starting Bun application..."

bun run dev