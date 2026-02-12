import { useState } from "react";
import './styles/sidebar.css';

export default function PreferenceDropdown({ labels = [], selected = [], onChange }){
    const [open, setOpen] = useState(false);

    function toggleLabel(label){
        if (selected.includes(label)) onChange(selected.filter(s => s !== label));
        else onChange([...selected, label]);
    }

    return (    
        <div style={{width: '100%'}}>
            <button 
                className="sideButton" 
                onClick={() => setOpen(o=>!o)} 
                style={{
                    width: '100%', 
                    minHeight: '45px',
                    justifyContent: 'space-between',
                    paddingLeft: '14px',
                    paddingRight: '14px',
                    fontSize: '15px'
                }}
            >
                <span>{selected.length ? `${selected.length} kiválasztva` : 'Válassz preferenciákat'}</span>
                <span style={{marginLeft: '8px'}}>{open ? '▲' : '▼'}</span>
            </button>
            {open && (
                <div style={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxHeight: 250,
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    borderRadius: '5px',
                    padding: '8px'
                }}>
                    {labels.map(label => {
                        const isSelected = selected.includes(label);
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => toggleLabel(label)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#EEEEEE' : 'transparent',
                                    color: isSelected ? '#BF3131' : '#EEEEEE',
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    fontSize: '14px',
                                    textAlign: 'left',
                                    transition: 'background-color 0.15s'
                                }}
                            >
                                <span style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '3px',
                                    border: isSelected ? '2px solid #BF3131' : '2px solid #EEEEEE',
                                    backgroundColor: isSelected ? '#BF3131' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontSize: '12px',
                                    color: '#EEEEEE'
                                }}>
                                    {isSelected ? '✓' : ''}
                                </span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
