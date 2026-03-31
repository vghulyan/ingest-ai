RAG = Retrieval-Augmented Generation
1. User asks: "What is the rent?"
2. System:
    i. searches document chunks (vector DB)
    ii. pulls relevant text
3. Sends to LLM:
    i. "Based on this context: [text], answer the question"
4. LLM answers grounded in data

