import Navigation from '@/components/Navigation';


export default function Help() {
    const faqs = [
      {
        question: "How does Plant Identifier work?",
        answer: "Plant Identifier uses advanced AI algorithms to analyze images of plants and compare them to our extensive database of plant species. It then provides detailed information about the identified plant, including its name, characteristics, and care instructions."
      },
      {
        question: "What types of plants can be identified?",
        answer: "Our system can identify a wide range of plants, including flowers, trees, shrubs, succulents, and house plants. However, the accuracy may vary depending on the quality of the image and the rarity of the plant species."
      },
      // Add more FAQs as needed
    ];
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B4332] to-[#081C15] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-thin text-center mb-8">Help Center</h1>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-thin mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="font-thin">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-thin mb-6">Still Need Help?</h2>
              <p className="mb-4">If you couldn't find the answer to your question, please don't hesitate to contact our support team:</p>
              <ul className="list-disc list-inside font-thin">
                <li>Email: support@plantidentifier.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Live Chat: Available Monday to Friday, 9 AM - 5 PM EST</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }