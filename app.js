document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('passwordForm');
    const messageDiv = document.getElementById('messageDiv');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ফর্ম ডেটা সংগ্রহ
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const userMessage = document.getElementById('message').value.trim();
        
        // ভ্যালিডেশন
        if (!name || !email || !password) {
            showMessage('দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।', 'error');
            return;
        }
        
        // Firebase Authentication দিয়ে লগইন চেষ্টা
        // এই ইমেইল/পাসওয়ার্ড আগে Firebase Console থেকে তৈরি করতে হবে
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // সফল লগইন
                showMessage('সফলভাবে লগইন হয়েছে! আপনাকে সুরক্ষিত পেইজে নিয়ে যাওয়া হচ্ছে...', 'success');
                
                // ইউজার ইনফো localStorage এ সংরক্ষণ (ঐচ্ছিক)
                localStorage.setItem('userName', name);
                localStorage.setItem('userMessage', userMessage);
                
                // ২ সেকেন্ড পর সুরক্ষিত পেইজে রিডাইরেক্ট
                setTimeout(() => {
                    window.location.href = "protected.html";
                }, 2000);
            })
            .catch((error) => {
                // লগইন ব্যর্থ
                const errorCode = error.code;
                let errorMessage = "লগইন ব্যর্থ হয়েছে।";
                
                if (errorCode === 'auth/wrong-password') {
                    errorMessage = 'ভুল পাসওয়ার্ড। দয়া করে আবার চেষ্টা করুন।';
                } else if (errorCode === 'auth/user-not-found') {
                    errorMessage = 'এই ইমেইল ঠিকানার কোনো অ্যাকাউন্ট নেই।';
                } else if (errorCode === 'auth/invalid-email') {
                    errorMessage = 'অবৈধ ইমেইল ঠিকানা।';
                }
                
                showMessage(errorMessage, 'error');
            });
    });
    
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
        
        // ৫ সেকেন্ড পর মেসেজ হাইড
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});