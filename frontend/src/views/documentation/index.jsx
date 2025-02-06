import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export default React.memo(function Documentation(){
    const {t, i18n} = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState('');

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
        
        if(selectedLanguage == 'ar'){
            document.getElementById('parent').style.direction = 'rtl';
        }else{
            document.getElementById('parent').style.direction = 'ltr';
        }
    }, [selectedLanguage]);

    console.log(i18n);

    return(
        <div className="container p-0 mx-auto">
            <div className="w-75 p-5 mx-auto" id="parent" style={{'backgroundColor':'#121d45'}}>
                <div className="w-100 mx-auto mb-5 p-0 text-center">
                    <div className="d-flex justify-content-end">
                        <DropdownButton
                            id="dropdown-basic-button"
                            title={t(selectedLanguage || 'en')}
                            onSelect={(e) => {
                                setSelectedLanguage(e);
                            }}
                        >
                            <Dropdown.Item eventKey="en">{t('en')}</Dropdown.Item>
                            <Dropdown.Item eventKey="fr">{t('fr')}</Dropdown.Item>
                            <Dropdown.Item eventKey="ar">{t('ar')}</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <h1>TMS</h1>
                    <h4 style={{'color':'#7551ff'}}>{t('titre')}</h4>
                    <p className="w- mx-auto my-4">{t('description')}</p>
                </div>
                <div className="w-100 mx-auto pt-5">
                    <h4>{t('titre-detail')}</h4>
                    {/* sign-in */}
                    <div className="mt-4">
                        <h5 style={{'color':'#7551ff'}}>{t('sign-in')}</h5>
                        <p>{t('sign-in-description')}</p>
                        <img src="../doc_images/sign-in.png" alt="sign-in picture" />
                    </div>
                    <hr />
                    {/* sign-up */}
                    <div className="mt-4">
                        <h5 style={{'color':'#7551ff'}}>{t('sign-up')}</h5>
                        <p>{t('sign-up-description')}</p>
                        <img src="../doc_images/sign-up.png" alt="sign-up picture" />
                    </div>
                    <hr />
                    {/* dashboard */}
                    <div className="mt-4">
                        <h5 style={{'color':'#7551ff'}}>{t('Dashboard')}</h5>
                        <p>{t('Dashboard-description')}</p>
                        <img src="../doc_images/dashboard.png" alt="dashboard picture" />
                        <li>{t('Dashboard-detail')}</li>
                    </div>
                    <hr />
                    {/* profile */}
                    <div className="mt-4">
                        <h5 style={{'color':'#7551ff'}}>{t('Profile')}</h5>
                        <p>{t('Profile-description')}</p>
                        <img src="../doc_images/profile.png" alt="profile picture" />
                        <li>{t('Profile-detail1')}</li>
                        <li>{t('Profile-detail2')}</li>
                    </div>
                    <hr />
                    {/* apps */}
                    <div className="mt-4">
                        <h5 style={{'color':'#7551ff'}}>{t('Apps')}</h5>
                        <p>{t('Apps-description')}</p>
                        <img src="../doc_images/apps.png" alt="apps picture" />
                        <li>{t('Apps-detail1')}</li>
                        <li>{t('Apps-detail2')}</li>
                        <li>{t('Apps-detail3')}</li>
                        <li>{t('Apps-detail4')}</li>
                    </div>
                    <hr />
                    {/* traslations */}
                    <div className="mt-4">
                        <h5 style={{'color':'#7551ff'}}>{t('Translations')}</h5>
                        <p>{t('Translations-description')}</p>
                        <img src="../doc_images/translations.png" alt="translations picture" />
                        <li>{t('Translations-detail1')}</li>
                        <li>{t('Translations-detail2')}</li>
                        <li>{t('Translations-detail3')}</li>
                        <li>{t('Translations-detail4')}</li>
                        <li>{t('Translations-detail5')}</li>
                    </div>
                    <hr />
                    {/* developers */}
                    <div className="mt-4">
                        <h5 style={{'color':'#7551ff'}}>{t('Developers')}</h5>
                        <p>{t('Developers-description')}</p>
                        <img src="../doc_images/developers.png" alt="developers picture" />
                        <li>{t('Developers-detail1')}</li>
                        <li>{t('Developers-detail2')}</li>
                    </div>
                    <hr />
                    {/* footer */}
                    <div className="mt-4 d-flex justify-content-between">
                        <span>&copy; {1900 + new Date().getYear()} TMS</span>
                        <Link className="DocLink" to={'/auth/sign-in'}>Sign-in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

// export default Documentation;