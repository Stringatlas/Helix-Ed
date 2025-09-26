<div class="container">
    <div class="hero-section">
        <h1>Recruiting</h1>
        <h2>Join Our Team and Make a Difference!</h2>
        <p class="intro-text">
            We are currently seeking enthusiastic and passionate individuals to join our growing organization. Whether you're a college student looking to become an instructor or a high school student
            interested in becoming a Teaching Assistant (TA), we have exciting opportunities for you. Additionally, we are looking for dedicated Social Media Managers and moderators to help us drive our
            BioBrawl initiatives.
        </p>
    </div>

    <div class="benefits-section">
        <h2>Why Join Us?</h2>

        <div class="benefit-item">
            <h3>Make a Meaningful Impact</h3>
            <p>Contribute to students' success by helping them excel in their academic journey, empowering them to achieve their goals, and inspiring them to discover new passions.</p>
        </div>

        <div class="benefit-item">
            <h3>Gain Valuable Experience</h3>
            <p>
                Enhance your skills in teaching, communication, and leadership while deepening your own interests and expertise in the subjects you're passionate about. At HelixEd, we believe in nurturing our
                members to grow and gain more than they initially bring, focusing on developing new skills and experiences rather than just relying on existing ones.
            </p>
        </div>

        <div class="benefit-item">
            <h3>Build Your Resume</h3>
            <p>Add valuable experience that will set you apart in the eyes of future employers and academic institutions, showcasing your commitment to education and personal growth.</p>
        </div>
    </div>

    <div class="positions-section">
        <h2>Available Positions</h2>
        <ul class="positions-list">
            <li class="position-item">
                <b>Instructors: </b>Perfect for college students with a strong background in various subjects. Share your knowledge, inspire the next generation of learners, and make a lasting impact on
                students' academic success.
            </li>
            <li class="position-item">
                <b>Teaching Assistants (TAs):</b> A fantastic opportunity for high school students to gain valuable teaching experience and contribute to the educational community. Explore exciting topics,
                deepen your understanding, and solidify your knowledge while supporting others.
            </li>
            <li class="position-item">
                <b>Social Media Managers: </b>Ideal for those passionate about marketing and graphic design. Help us enhance our presence on Instagram, Facebook, and LinkedIn by creating engaging content
                and building our online community.
            </li>
            <li class="position-item">
                <b>BioBrawl Moderators: </b>An exciting role for both high school and college students to participate in facilitating and managing a dynamic biology competition. This position not only
                allows you to contribute to a fast-paced event but also provides the opportunity to earn volunteer hours.
            </li>
        </ul>
    </div>

    <div class="cta-section">
        <h2>Ready to make a difference?</h2>
        <p class="apply-text">Apply here at: <a href="https://tinyurl.com/HelixEd-Application" class="apply-link">https://tinyurl.com/HelixEd-Application</a></p>
    </div>
</div>

<style lang="scss">
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 3rem 2rem;
        line-height: 1.6;
        background: transparent;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .hero-section {
        text-align: center;
        margin-bottom: 4rem;
        padding-bottom: 3rem;
        border-bottom: 2px solid rgba($accent, 0.1);
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: bold;
            background: linear-gradient(135deg, $accent 0%, darken($accent, 20%) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        h2 {
            font-size: 1.6rem;
            margin-bottom: 1.5rem;
            color: $accent;
            font-weight: 500;
        }
        
        .intro-text {
            font-size: 1.1rem;
            color: darken($text-color, 20%);
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.7;
        }
    }

    .benefits-section {
        margin-bottom: 4rem;
        
        > h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
            text-align: center;
            font-weight: 600;
            color: $accent;
        }
        
        .benefit-item {
            margin-bottom: 2.5rem;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 15px;
            border-left: 6px solid $primary;
            transition: all 0.3s ease;
            border-top: 1px solid rgba($primary, 0.1);
            border-right: 1px solid rgba($primary, 0.1);
            border-bottom: 1px solid rgba($primary, 0.1);
            
            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba($primary, 0.15);
                background: rgba(255, 255, 255, 0.9);
                border-left: 6px solid $primary;
                border-top-color: rgba($primary, 0.2);
                border-right-color: rgba($primary, 0.2);
                border-bottom-color: rgba($primary, 0.2);
            }
            
            h3 {
                font-size: 1.4rem;
                margin-bottom: 0.75rem;
                color: $accent;
                font-weight: 600;
            }
            
            p {
                color: darken($text-color, 15%);
                font-size: 1rem;
                line-height: 1.6;
                margin: 0;
            }
        }
    }

    .positions-section {
        margin-bottom: 4rem;
        
        h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
            text-align: center;
            font-weight: 600;
            color: $accent;
        }
        
        .positions-list {
            list-style: none;
            padding: 0;
            margin: 0;
            
            .position-item {
                background: rgba(255, 255, 255, 0.7);
                border-radius: 15px;
                padding: 2rem;
                margin-bottom: 1.5rem;
                border-left: 6px solid $secondary;
                font-size: 1rem;
                line-height: 1.6;
                color: darken($text-color, 15%);
                transition: all 0.3s ease;
                border-top: 1px solid rgba($secondary, 0.1);
                border-right: 1px solid rgba($secondary, 0.1);
                border-bottom: 1px solid rgba($secondary, 0.1);
                
                &:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba($secondary, 0.15);
                    background: rgba(255, 255, 255, 0.9);
                    border-left: 6px solid $secondary;
                    border-top-color: rgba($secondary, 0.2);
                    border-right-color: rgba($secondary, 0.2);
                    border-bottom-color: rgba($secondary, 0.2);
                }
                
                b {
                    color: $accent;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .cta-section {
        text-align: center;
        padding: 3rem 2rem;
        background: linear-gradient(135deg, rgba($accent, 0.05) 0%, rgba($primary, 0.1) 50%, rgba($secondary, 0.05) 100%);
        border-radius: 20px;
        border: 2px solid rgba($accent, 0.15);
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: shimmer 3s infinite;
        }
        
        h2 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: $accent;
            font-weight: 600;
            position: relative;
            z-index: 1;
        }
        
        .apply-text {
            font-size: 1.2rem;
            margin: 0;
            color: darken($text-color, 10%);
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            
            .apply-link {
                display: inline-block;
                padding: 1rem 2rem;
                background: linear-gradient(135deg, $accent 0%, darken($accent, 15%) 100%);
                color: white;
                text-decoration: none;
                font-weight: 600;
                border-radius: 50px;
                font-size: 1.1rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 15px rgba($accent, 0.3);
                position: relative;
                overflow: hidden;
                
                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }
                
                &:hover {
                    transform: translateY(-4px) scale(1.05);
                    box-shadow: 0 8px 25px rgba($accent, 0.4);
                    background: linear-gradient(135deg, lighten($accent, 10%) 0%, $accent 100%);
                    
                    &::before {
                        left: 100%;
                    }
                }
                
                &:active {
                    transform: translateY(-2px) scale(1.02);
                }
            }
        }
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }

    // Responsive design
    @media (max-width: 768px) {
        .container {
            padding: 2rem 1rem;
        }
        
        .hero-section {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            
            h1 {
                font-size: 2rem;
            }
            
            h2 {
                font-size: 1.3rem;
            }
        }
        
        .benefits-section,
        .positions-section {
            margin-bottom: 3rem;
            
            > h2 {
                font-size: 1.7rem;
                margin-bottom: 1.5rem;
            }
        }
        
        .benefit-item,
        .position-item {
            padding: 1rem;
        }
        
        .cta-section {
            padding: 2rem 1rem;
            
            h2 {
                font-size: 1.5rem;
            }
            
            .apply-text .apply-link {
                display: block;
                margin: 1rem 0 0 0;
                padding: 0.75rem 1rem;
            }
        }
    }
</style>
