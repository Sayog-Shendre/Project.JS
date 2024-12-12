import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, ContentState, convertFromHTML, convertToHTML } from 'draft-js';

const EditorComponent = () => {
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const [savedContent, setSavedContent] = React.useState('');

  React.useEffect(() => {
    const storedContent = localStorage.getItem('editorContent');
    if (storedContent) {
      const contentState = convertFromHTML(storedContent);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const html = convertToHTML(contentState);
    localStorage.setItem('editorContent', html);
  };

  const handleBeforeInput = (chars) => {
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(editorState.getSelection().getStartKey());
    const currentText = currentBlock.getText();
    const currentSelection = editorState.getSelection();

    if (chars === ' ' && currentText.startsWith('#')) {
      const newContentState = EditorState.push(editorState, ContentState.createFromText(currentText.slice(1)), 'insert-characters');
      const newEditorState = EditorState.forceSelection(newContentState, currentSelection.merge({
        anchorOffset: currentSelection.anchorOffset - 1,
        focusOffset: currentSelection.focusOffset - 1,
      }));
      const newContentStateWithHeading = newEditorState.getCurrentContent().merge({
        inlineStyleRanges: [
          {
            offset: 0,
            length: newEditorState.getCurrentContent().getPlainText().length,
            style: 'HEADING',
          },
        ],
      });
      setEditorState(EditorState.createWithContent(newContentStateWithHeading));
      return 'handled';
    }

    if (chars === ' ' && currentText.startsWith('*')) {
      const newContentState = EditorState.push(editorState, ContentState.createFromText(currentText.slice(1)), 'insert-characters');
      const newEditorState = EditorState.forceSelection(newContentState, currentSelection.merge({
        anchorOffset: currentSelection.anchorOffset - 1,
        focusOffset: currentSelection.focusOffset - 1,
      }));
      const newContentStateWithBold = newEditorState.getCurrentContent().merge({
        inlineStyleRanges: [
          {
            offset: 0,
            length: newEditorState.getCurrentContent().getPlainText().length,
            style: 'BOLD',
          },
        ],
      });
      setEditorState(EditorState.createWithContent(newContentStateWithBold));
      return 'handled';
    }

    if (chars === ' ' && currentText.startsWith('**')) {
      const newContentState = EditorState.push(editorState, ContentState.createFromText(currentText.slice(2)), 'insert-characters');
      const newEditorState = EditorState.forceSelection(newContentState, currentSelection.merge({
        anchorOffset: currentSelection.anchorOffset - 2,
        focusOffset: currentSelection.focusOffset - 2,
      }));
      const newContentStateWithRed = newEditorState.getCurrentContent().merge({
        inlineStyleRanges: [
          {
            offset: 0,
            length: newEditorState.getCurrentContent().getPlainText().length,
            style: 'RED',
          },
        ],
      });
      setEditorState(EditorState.createWithContent(newContentStateWithRed));
      return 'handled';
    }

    if (chars === ' ' && currentText.startsWith('***')) {
      const newContentState = EditorState.push(editorState, ContentState.createFromText(currentText.slice(3)), 'insert-characters');
      const newEditorState = EditorState.forceSelection(newContentState, currentSelection.merge({
        anchorOffset: currentSelection.anchorOffset - 3,
        focusOffset: currentSelection.focusOffset - 3,
      }));
      const newContentStateWithUnderline = newEditorState.getCurrentContent().merge({
        inlineStyleRanges: [
          {
            offset: 0,
            length: newEditorState.getCurrentContent().getPlainText().length,
            style: 'UNDERLINE',
          },
        ],
      });
      setEditorState(EditorState.createWithContent(newContentStateWithUnderline));
      return 'handled';
    }

    return 'not-handled';
  };

  const handleKeyCommand = (command) => {
    if (command === 'underline') {
      const newEditorState = EditorState.toggleInlineStyle(editorState, 'UNDERLINE');
      setEditorState(newEditorState);
      return 'handled';
    }

    if (command === 'strikethrough') {
      const newEditorState = EditorState.toggleInlineStyle(editorState, 'STRIKETHROUGH');
      setEditorState(newEditorState);
      return 'handled';
    }

    if (command === 'code') {
      const newEditorState = EditorState.toggleInlineStyle(editorState, 'CODE');
      setEditorState(newEditorState);
      return 'handled';
    }
    
    if (command === 'bold') {
      const newEditorState = EditorState.toggleInlineStyle(editorState, 'BOLD');
      setEditorState(newEditorState);
      return 'handled';
    }
    
    if (command === 'italic') {
      const newEditorState = EditorState.toggleInlineStyle(editorState, 'ITALIC');
      setEditorState(newEditorState);
      return 'handled';
    }
    
    if (command === 'heading') {
      const newEditorState = EditorState.toggleInlineStyle(editorState, 'HEADING');
      setEditorState(newEditorState);
      return 'handled';
    }
    
    return 'not-handled';
    };
    
    const handlePastedText = (pastedText) => {
      const newEditorState = EditorState.push(editorState, ContentState.createFromText(pastedText), 'insert-characters');
      setEditorState(newEditorState);
    };
    
    const handleReturn = () => {
      const newEditorState = EditorState.push(editorState, ContentState.createFromText('\n'), 'insert-characters');
      setEditorState(newEditorState);
    };
    
    return (
      <div className="Editor">
        <Editor
          editorState={editorState}
          onChange={(newEditorState) => setEditorState(newEditorState)}
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
          handlePastedText={handlePastedText}
          handleReturn={handleReturn}
        />
        <button onClick={handleSave}>Save</button>
      </div>
    );
    };
    
    ReactDOM.render(<EditorComponent />, document.getElementById('root'));