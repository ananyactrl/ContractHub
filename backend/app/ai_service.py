import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    def analyze_contract(self, contract_text):
        prompt = f"""
        Analyze this contract and provide:
        1. Key terms and conditions
        2. Risk assessment (High/Medium/Low)
        3. Important dates and deadlines
        4. Potential issues or red flags
        
        Contract: {contract_text}
        """
        
        response = self.model.generate_content(prompt)
        return response.text
    
    def ask_contract_question(self, contract_text, question):
        prompt = f"""
        Based on this contract: {contract_text}
        
        Answer this question: {question}
        
        Provide a clear, accurate answer based only on the contract content.
        """
        
        response = self.model.generate_content(prompt)
        return response.text
