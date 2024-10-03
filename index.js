let textInput, statusLabel, nativeCopyButton, openfinCopyButton;

async function onContentLoaded() {
    textInput = document.getElementById('textInput');
    statusLabel = document.getElementById('statusLabel');
    nativeCopyButton = document.getElementById('nativeCopyButton');
    openfinCopyButton = document.getElementById('openfinCopyButton');

    if (typeof fin !== 'undefined') {
        fin.System.getVersion()
            .then(version => {
                header.textContent += ` - Runtime Version: ${version}`;
            })
            .catch(err => {
                console.error('Error getting OpenFin version:', err);
            });
    }

    nativeCopyButton.addEventListener('click', copyViaNavigatorClipboard);
    openfinCopyButton.addEventListener('click', copyViaFinClipboard);
}

async function copyViaNavigatorClipboard() {
    const text = textInput.value;

    if (!navigator.clipboard) {
        statusLabel.textContent = 'Clipboard API not available.';
        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        statusLabel.style.color = 'green';
        statusLabel.textContent = 'Text copied to clipboard using navigator.clipboard API.';
    }
    catch (err) {
        statusLabel.style.color = 'red';
        statusLabel.textContent = 'Failed to copy text with navigator.clipboard API.';
        console.error('Error copying text with navigator.clipboard API: ', err);
    }
}

async function copyViaFinClipboard() {
    const text = textInput.value;
    
    if (typeof fin !== 'undefined' && fin.Clipboard) {
        try {
            await fin.Clipboard.writeText({
                data: text,
                type: 'text'
            });

            statusLabel.style.color = 'green';
            statusLabel.textContent = 'Text copied to clipboard using OpenFin API.';
        }
        catch (err) {
            statusLabel.style.color = 'red';
            statusLabel.textContent = 'Failed to copy text with OpenFin API.';
            console.error('Error copying text with OpenFin API: ', err);
        }
    }
    else {
        statusLabel.style.color = 'red';
        statusLabel.textContent = 'OpenFin Clipboard API not available.';
        console.warn('OpenFin Clipboard API not available.');
    }
}

document.addEventListener('DOMContentLoaded', onContentLoaded);