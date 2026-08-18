extends CharacterBody2D

const SPEED = 200

var direction : Vector2
var playback : AnimationNodeStateMachinePlayback
# Must outlive _ready(): a local would be freed and the message listener would go dead
var _js_callback : JavaScriptObject

@onready var animation_tree: AnimationTree = $AnimationTree
@onready var join_popup: Control = $"../CanvasLayer/Join_Popup"
@onready var sprite_2d: Sprite2D = $Sprite2D

# Character sprite sheets
const TINY_CAT_SPRITESHEET_BLACK_00 = preload("uid://dypf8pdgpftxo")
const TINY_CAT_SPRITESHEET_BROWN_00 = preload("uid://dhkbn7qb1qcjv")
const TINY_CAT_SPRITESHEET_CALICO_00 = preload("uid://ce71aumqc1oi2")
const TINY_CAT_SPRITESHEET_COTTONCANDY = preload("uid://bgd3570uvnrwd")
const TINY_CAT_SPRITESHEET_CREME_00 = preload("uid://b6ro755ckq1b5")
const TINY_CAT_SPRITESHEET_GHOST = preload("uid://dipnhws0y6cbf")
const TINY_CAT_SPRITESHEET_GREY_00 = preload("uid://c5lklic5on7qk")
const TINY_CAT_SPRITESHEET_GREYSCALE = preload("uid://c2wsynqj8gbbt")
const TINY_CAT_SPRITESHEET_HAIRLESS_00 = preload("uid://cee1netfee122")
const TINY_CAT_SPRITESHEET_ORANGE_00 = preload("uid://3jvgnysjrw4q")
const TINY_CAT_SPRITESHEET_RETROGREEN = preload("uid://b7ftnfbavmddw")
const TINY_CAT_SPRITESHEET_TAN_00 = preload("uid://c8hooeuofjw3l")
const TINY_CAT_SPRITESHEET_WHITE_00 = preload("uid://il471h4nc3p6")


func _ready():
	add_to_group("player")
	playback = animation_tree["parameters/playback"]
	
	if OS.has_feature("web"):
		_js_callback = JavaScriptBridge.create_callback(_on_js_message)
		JavaScriptBridge.get_interface("window").addEventListener("message", _js_callback)
		# Tell the React host we can receive messages now; it replies with the profile's cat
		JavaScriptBridge.eval("""window.parent.postMessage({ type: 'GODOT_READY' }, '*');""")


func _physics_process(delta: float) -> void:

	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
	direction = Input.get_vector("left", "right", "up", "down")
	if direction:
		velocity = direction * SPEED
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.y = move_toward(velocity.y, 0, SPEED)

	move_and_slide()
	select_animation()
	update_animation_parameters()

func select_animation():
	if velocity == Vector2.ZERO:
		playback.travel("Idle")	
	else:
		playback.travel("Walk")

func update_animation_parameters():
	if direction:
		animation_tree["parameters/Idle/blend_position"] = direction
		animation_tree["parameters/Walk/blend_position"] = direction
		animation_tree["parameters/Sit/blend_position"] = direction

func sit():
	set_physics_process(false)
	playback.travel("Sit")
	while true:
		var completed_state = await animation_tree.animation_finished
		if completed_state.begins_with("sit"):
			join_popup.show()
			break
	
	#if OS.has_feature("web"):
		#JavaScriptBridge.eval("""window.parent.postMessage({ type: 'AVATAR_SAT_DOWN' }, '*');""")

func change_character(name) -> bool:
	match name:
		"black":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_BLACK_00
		"brown":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_BROWN_00
		"calico":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_CALICO_00
		"cottoncandy":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_COTTONCANDY
		"creme":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_CREME_00
		"ghost":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_GHOST
		"grey":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_GREY_00
		"greyscale":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_GREYSCALE
		"hairless":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_HAIRLESS_00
		"orange":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_ORANGE_00
		"retrogreen":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_RETROGREEN
		"tan":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_TAN_00
		"white":
			sprite_2d.texture = TINY_CAT_SPRITESHEET_WHITE_00
		_:
			return false
	return true
	
func _on_js_message(args):
	var event = args[0]
	var data = event.data
	if data == null or data.type == null:
		return
	if data.type == "SET_CHARACTER":
		var ok = change_character(data.cat)
