export const shareOnWhatsApp = (phone, message) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(url, '_blank');
};
