import React, { useState } from "react";
import langStyles from "../Css/languageTranstations.module.css";


const LanguageTranstations = ({  languageOptions}) => {
    const [needTranslation, setNeedTranslation] = useState(null);
    const [selectedLanguageLocal, setSelectedLanguageLocal] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);


   
 
    const handleSubmit = async () => {
        setLoading(true); // start loader
        if (needTranslation === true) {
            try {
              
                if(typeof window.languageChangeQuestion === "function" && selectedLanguageLocal.code){
                    console.log("calll agani",selectedLanguageLocal.code)
                    window.languageChangeQuestion(selectedLanguageLocal.code,needTranslation);
                }

            } catch (e) {
                console.log("Language Translate error", e)
            }finally{
                console.log("final submitions --------")
                // setLoading(false);
            }
        }
        // setLoading(false); 
    };
    const handlNotSelected = async (value) => {
        setLoading(true); // start loader
        if (value === false) {
            console.log(value,"needTranslation")
            try {
                if(typeof window.languageChangeQuestion === "function"){
                    console.log("calll agani no conditions")
                    window.languageChangeQuestion("",value);
                }

            } catch (e) {
                console.log("Language Translate error", e)
            }
        }
        // setLoading(false); 
    };

    const selectLanguageHandler = (value) => {
        setNeedTranslation(value);
        if (value === false) {
            setSelectedLanguageLocal("");
            handlNotSelected(value)
          
        }
    };

    const handleLanguageSelect = (lang) => {
        setSelectedLanguageLocal(lang);
        setDropdownOpen(false);
    };

    return (
        <div className={langStyles.outcontainerreadout}>
            { !loading? (<div className={langStyles.popup}>
                <h2>Do you need language translation?</h2>

                {/* Yes / No Buttons */}
                <div className={langStyles.buttons}>
                    <button
                        className={`${langStyles.btn} ${needTranslation === true ? langStyles.active : ""}`}
                        onClick={() => selectLanguageHandler(true)}
                    >
                        Yes
                    </button>
                    <button
                        className={`${langStyles.btn} ${needTranslation === false ? langStyles.active : ""}`}
                        onClick={() => selectLanguageHandler(false)}
                    >
                        No
                    </button>
                </div>

                {/* Dropdown */}
                {needTranslation === true && (
                    <div className={langStyles.dropdownWrapper}>
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className={langStyles.dropdownToggle}
                        >
                            {selectedLanguageLocal?.name || "Select a language"}
                            <span className={langStyles.arrow}>
                                {dropdownOpen ? "▲" : "▼"}
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div className={langStyles.dropdownMenu}>
                                {languageOptions.map((lang) => (
                                    <div
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang)}
                                        className={`${langStyles.dropdownItem} 
                                         ${selectedLanguageLocal.lang === lang.name ? langStyles.selectedItem : ""}`}
                                    >
                                        {lang.name}  {/* 👈 FIX: use name instead of label */}
                                        {selectedLanguageLocal.code === lang.code && <span>✔</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                {needTranslation === true && (
                    <button
                        className={`${langStyles.subbtn} ${langStyles.submitBtn}`}
                        onClick={handleSubmit}
                        disabled={!selectedLanguageLocal?.code}
                    >
                        Submit
                    </button>
                )}
            </div>):(<div className={langStyles.loader}></div>)}
        </div>
    );
};

export default LanguageTranstations;
