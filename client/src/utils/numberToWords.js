export const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const format = (n, suffix) => {
        if (n === 0) return '';
        let str = '';
        if (n > 19) {
            str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
        } else {
            str += a[n];
        }
        if (n > 0) str += suffix;
        return str;
    };

    let res = '';
    res += format(Math.floor(num / 10000000), 'Crore ');
    res += format(Math.floor((num / 100000) % 100), 'Lakh ');
    res += format(Math.floor((num / 1000) % 100), 'Thousand ');
    res += format(Math.floor((num / 100) % 10), 'Hundred ');
    if (num > 100 && num % 100 > 0) res += 'And ';
    res += format(num % 100, '');

    return res.trim();
};
