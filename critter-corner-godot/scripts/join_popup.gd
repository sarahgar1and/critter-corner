extends Control

@onready var join_popup: Control = $"."

func _on_yes_pressed() -> void:
	if OS.has_feature("web"):
		JavaScriptBridge.eval("""window.parent.postMessage({ type: 'ENTER_ROOM' }, '*');""")
	join_popup.hide()
	
func _on_no_pressed() -> void:
	join_popup.hide()
