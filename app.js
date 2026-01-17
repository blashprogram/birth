 document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('passwordForm');
            const messageDiv = document.getElementById('messageDiv');
            const correctEmail = 'e@gmail.com';
            const correctPassword = 'yes,,,,';
            
            // টেস্ট বাটনগুলির জন্য ইভেন্ট হ্যান্ডলার
            document.querySelectorAll('.test-button').forEach(button => {
                button.addEventListener('click', function() {
                    const emailInput = document.getElementById('email');
                    const passwordInput = document.getElementById('password');
                    
                    emailInput.value = this.getAttribute('data-email');
                    passwordInput.value = this.getAttribute('data-password');
                    
                    // ইনপুট ইভেন্ট ট্রিগার করি যাতে স্ট্যাটাস আপডেট হয়
                    emailInput.dispatchEvent(new Event('input'));
                    passwordInput.dispatchEvent(new Event('input'));
                    
                    // ফর্ম সাবমিট ইভেন্ট ট্রিগার
                    form.dispatchEvent(new Event('submit', { cancelable: true }));
                });
            });
            
            // ইনপুট ফিল্ডের অবস্থা আপডেট করার ফাংশন
            function updateInputStatus() {
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
                const emailStatus = document.getElementById('email-status');
                const passwordStatus = document.getElementById('password-status');
                
                // ইমেইল স্ট্যাটাস
                if (email === '') {
                    document.getElementById('email').classList.remove('correct', 'incorrect');
                    emailStatus.className = 'status-fill';
                    emailStatus.style.width = '0%';
                } else if (email === correctEmail) {
                    document.getElementById('email').classList.remove('incorrect');
                    document.getElementById('email').classList.add('correct');
                    emailStatus.className = 'status-fill correct';
                    emailStatus.style.width = '100%';
                } else {
                    document.getElementById('email').classList.remove('correct');
                    document.getElementById('email').classList.add('incorrect');
                    emailStatus.className = 'status-fill incorrect';
                    emailStatus.style.width = '100%';
                }
                
                // পাসওয়ার্ড স্ট্যাটাস
                if (password === '') {
                    document.getElementById('password').classList.remove('correct', 'incorrect');
                    passwordStatus.className = 'status-fill';
                    passwordStatus.style.width = '0%';
                } else if (password === correctPassword) {
                    document.getElementById('password').classList.remove('incorrect');
                    document.getElementById('password').classList.add('correct');
                    passwordStatus.className = 'status-fill correct';
                    passwordStatus.style.width = '100%';
                } else {
                    document.getElementById('password').classList.remove('correct');
                    document.getElementById('password').classList.add('incorrect');
                    passwordStatus.className = 'status-fill incorrect';
                    passwordStatus.style.width = '100%';
                }
            }
            
            // ইনপুট পরিবর্তন হলে স্ট্যাটাস আপডেট করুন
            document.getElementById('email').addEventListener('input', updateInputStatus);
            document.getElementById('password').addEventListener('input', updateInputStatus);
            
            // ফর্ম সাবমিট হ্যান্ডলার
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // ইনপুট ভ্যালু পাওয়া
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value.trim();
                const name = document.getElementById('name').value.trim();
                const message = document.getElementById('message').value.trim();
                
                // মেসেজ ডিভ সেটআপ
                messageDiv.style.display = 'block';
                messageDiv.className = 'message';
                
                // ভ্যালিডেশন
                if (!name || !email || !password) {
                    showMessage('দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন।', 'error');
                    return;
                }
                
                // ইমেইল ফরম্যাট চেক
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showMessage('দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন।', 'error');
                    return;
                }
                
                // চেকিং লজিক
                const isEmailCorrect = email === correctEmail;
                const isPasswordCorrect = password === correctPassword;
                
                // বিভিন্ন অবস্থার জন্য মেসেজ
                if (isEmailCorrect && isPasswordCorrect) {
                    showMessage('লগিন সফল! আপনাকে সুরক্ষিত পেইজে নিয়ে যাওয়া হচ্ছে...', 'success');
                    
                    // ২ সেকেন্ড পর mnm.html পেজে রিডাইরেক্ট
                    setTimeout(() => {
                        // যদি mnm.html ফাইল না থাকে, আমরা ডেমো কন্টেন্ট দেখাবো
                        window.location.href = 'protected.html';
                    }, 2000);
                    
                    // বিকল্পভাবে, যদি mnm.html না থাকে, আমরা মেমোরিতে স্টোর করে অন্য পেজে নিয়ে যেতে পারি
                    // এখানে আমরা ইউজার ইনফো localStorage এ সেভ করছি
                    localStorage.setItem('userName', name);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userMessage', message);
                    localStorage.setItem('loginTime', new Date().toLocaleString());
                    
                } else if (!isEmailCorrect && isPasswordCorrect) {
                    showMessage('পাসওয়ার্ড ঠিক, কিন্তু ইমেইল ভুল', 'error');
                } else if (isEmailCorrect && !isPasswordCorrect) {
                    showMessage('ইমেইল ঠিক, কিন্তু পাসওয়ার্ড ভুল', 'error');
                } else {
                    showMessage('ইমেইল এবং পাসওয়ার্ড দুটিই ভুল', 'error');
                }
                
                // ইনপুট স্ট্যাটাস আপডেট করুন
                updateInputStatus();
            });
            
            // মেসেজ দেখানোর ফাংশন
            function showMessage(text, type) {
                messageDiv.textContent = text;
                messageDiv.className = `message ${type}`;
                messageDiv.style.display = 'block';
                
                // ৫ সেকেন্ড পর মেসেজ আপনা-আপনি লুকিয়ে যাবে
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }
            
            // প্রাথমিক স্ট্যাটাস আপডেট
            updateInputStatus();
        });