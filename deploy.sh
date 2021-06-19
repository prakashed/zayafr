# deploying o3schools-webforms
# checking if .env is present
if [ ! -f .env ]; then
    echo "You need to create .env from .env.sample before you can build"
    exit 0
fi
# building using yarn
yarn
yarn prebuild
yarn build