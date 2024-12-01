// import React from 'react';
// import { motion } from 'framer-motion';
// import { Card, CardContent } from '../components/ui/card';

// const FormatAIResponse = ({ message }) => {
//   // Helper function to detect content type
//   const getContentType = (text) => {
//     if (text.startsWith('- ') || text.match(/^\d+\./)) return 'list';
//     if (text.includes('```')) return 'code';
//     if (text.startsWith('Note:') || text.startsWith('Warning:')) return 'note';
//     return 'paragraph';
//   };

//   // Helper function to process lists
//   const processList = (text) => {
//     return text.split('\n').filter(item => item.trim());
//   };

//   // Helper function to process the message content
//   const processContent = (content) => {
//     const blocks = content.split('\n\n');
//     return blocks.map((block, index) => {
//       const type = getContentType(block);

//       switch (type) {
//         case 'list':
//           const items = processList(block);
//           return (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//               className="my-4"
//             >
//               <div className="flex items-start space-x-2">
//                 <FaListUl className="mt-1 text-blue-400" />
//                 <ul className="space-y-2">
//                   {items.map((item, i) => (
//                     <li key={i} className="flex items-start space-x-2">
//                       <span className="text-gray-200">
//                         {item.replace(/^-\s|^\d+\.\s/, '')}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </motion.div>
//           );

//         case 'code':
//           const code = block.replace(/```\w*\n?|\n?```/g, '');
//           return (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//               className="my-4"
//             >
//               <Card className="bg-gray-900 p-4 rounded-lg">
//                 <CardContent className="font-mono text-sm text-gray-300">
//                   {code}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           );

//         case 'note':
//           return (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//               className="my-4"
//             >
//               <div className="flex items-start space-x-2 bg-blue-900/20 p-4 rounded-lg">
//                 <FaInfoCircle className="mt-1 text-blue-400" />
//                 <p className="text-gray-200">{block}</p>
//               </div>
//             </motion.div>
//           );

//         default:
//           return (
//             <motion.p
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//               className="my-4 text-gray-200"
//             >
//               {block}
//             </motion.p>
//           );
//       }
//     });
//   };

//   return (
//     <div className="ai-response-container space-y-4">
//       {processContent(message)}
//     </div>
//   );
// };

// export default FormatAIResponse;