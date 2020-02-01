## How to install a private Chrome extension

> There is a simple way to install locally-hosted Chrome extensions for personal use. I use this method for my own authoring, testing, and use on my machine.
>
> If it is just an extension, you can put all of your files (background, manifest, etc) into a directory on your computer. Then, open Chrome and do the following:
>
> 1. Navigate to `chrome:extensions` in the omnibar.
> 2. Make sure the **Developer Mode** box is checked
> 3. Click on "**Load unpacked extension**"
> 4. In the file browser, navigate to your directory and click "**Open**"
>
> Chrome will install the extension to your machine. No need for the `.crx` file. To distribute this to colleagues, you could host the file for download in Dropbox or your Drive account. They would need to follow the same process to install the extension on their machine.
>
> **Do note** that if you make updates to the extension for stability or other compatibility upgrades, **each person** with the extension will need to download the updated directory and then update the extension manually.

_(source: [https://stackoverflow.com/questions/21581645/#21588748](https://stackoverflow.com/questions/21581645/#21588748))_
