const quotes = [
    {
        text: "BillFlow saved us over 20 hours a month on accounting. Truly a game changer.",
        author: "CEO, TechStack Solutions"
    },
    {
        text: "The most intuitive billing platform we've ever used. Our clients love the professional invoices.",
        author: "Founder, Creative Pulse"
    },
    {
        text: "Switching to BillFlow was the best decision for our growing startup. Seamless and powerful.",
        author: "Director, Innovate Labs"
    },
    {
        text: "Precision, speed, and elegance. BillFlow is the gold standard for modern business finance.",
        author: "CFO, Global Retail Group"
    },
    {
        text: "Managing GST used to be a nightmare until we found BillFlow. Now it's just a few clicks.",
        author: "Owner, Prime Distributing"
    }
];

export const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
};
